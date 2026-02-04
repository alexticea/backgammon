use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("BgAmMonGameContractAddress1111111111111111");

#[program]
pub mod backgammon_escrow {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, game_id: String, stake_amount: u64) -> Result<()> {
        let game = &mut ctx.accounts.game_account;
        game.game_id = game_id;
        game.stake_amount = stake_amount;
        game.player_1 = *ctx.accounts.player.key;
        game.state = GameState::WaitingForDeposits;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, game_id: String) -> Result<()> {
        let game = &mut ctx.accounts.game_account;
        let player = &ctx.accounts.player;
        
        // 1. Verify Player is part of the game
        require!(
            player.key() == game.player_1 || (game.player_2 == Pubkey::default() || player.key() == game.player_2),
            ErrorCode::InvalidPlayer
        );

        // 2. Transfer SOL from Player to Game PDA
        let instruction = system_instruction::transfer(
            player.key,
            &game.key(),
            game.stake_amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &instruction,
            &[
                player.to_account_info(),
                game.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // 3. Update State
        if player.key() == game.player_1 {
            game.p1_deposited = true;
        } else {
            // Assign Player 2 if not set
            if game.player_2 == Pubkey::default() {
                game.player_2 = *player.key;
            }
            game.p2_deposited = true;
        }

        if game.p1_deposited && game.p2_deposited {
            game.state = GameState::Active;
        }

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>, game_id: String, winner: Pubkey) -> Result<()> {
        let game = &mut ctx.accounts.game_account;
        
        // Only the Server (Admin) can authorize the result to preventing cheating
        // In a boundless P2P version, we would verify the game moves on-chain (expensive)
        // or use a ZK proof. For now, we trust the "Referee" signer.
        require!(ctx.accounts.referee.key() == game.referee, ErrorCode::Unauthorized);
        
        require!(game.state == GameState::Active, ErrorCode::InvalidState);

        // Transfer pot to Winner
        let pot_balance = game.to_account_info().lamports();
        **game.to_account_info().try_borrow_mut_lamports()? -= pot_balance;
        **ctx.accounts.winner.try_borrow_mut_lamports()? += pot_balance;

        game.state = GameState::Completed;
        game.winner = winner;

        Ok(())
    }
}

#[account]
pub struct GameAccount {
    pub game_id: String,
    pub referee: Pubkey, // The Server Key
    pub player_1: Pubkey,
    pub player_2: Pubkey,
    pub stake_amount: u64,
    pub p1_deposited: bool,
    pub p2_deposited: bool,
    pub state: GameState,
    pub winner: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    WaitingForDeposits,
    Active,
    Completed
}

#[derive(Accounts)]
#[instruction(game_id: String)]
pub struct InitializeGame<'info> {
    #[account(
        init, 
        seeds = [b"game", game_id.as_bytes()], 
        bump, 
        payer = player, 
        space = 8 + 32 + 32 + 32 + 8 + 1 + 1 + 1 + 32 + 50
    )]
    pub game_account: Account<'info, GameAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_id: String)]
pub struct Deposit<'info> {
    #[account(mut, seeds = [b"game", game_id.as_bytes()], bump)]
    pub game_account: Account<'info, GameAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_id: String)]
pub struct ClaimWinnings<'info> {
    #[account(mut, seeds = [b"game", game_id.as_bytes()], bump)]
    pub game_account: Account<'info, GameAccount>,
    pub referee: Signer<'info>, // Server Authority
    #[account(mut)]
    pub winner: SystemAccount<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not part of this game.")]
    InvalidPlayer,
    #[msg("Game is not active.")]
    InvalidState,
    #[msg("Unauthorized referee.")]
    Unauthorized,
}
