use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("FDSc4rBTtn2Dda7og9iVCR5N69q6jspJdycZK2GggiRF"); // Placeholder ID

#[program]
pub mod backgammon {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // Deposit SOL into a PDA specifically for this user
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let user = &ctx.accounts.user;

        // Transfer SOL from User to UserAccount PDA
        // We use the system program to transfer
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: user.to_account_info(),
                to: user_account.to_account_info(),
            },
        );
        
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        // Update State
        user_account.balance += amount;
        user_account.authority = *user.key;

        msg!("Deposited {} lamports. New Balance: {}", amount, user_account.balance);
        Ok(())
    }

    // Withdraw SOL from the PDA back to the user
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let user = &ctx.accounts.user;

        if user_account.balance < amount {
            return Err(ErrorCode::InsufficientFunds.into());
        }

        // Transfer SOL from PDA to User
        // Since PDA "owns" itself but doesn't have a private key, we authorize via seeds
        **user_account.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;

        user_account.balance -= amount;

        msg!("Withdrew {} lamports. New Balance: {}", amount, user_account.balance);
        Ok(())
    }
}

#[derive(Accounts)]
pub mod initialize {}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 8 + 32, // Discriminator + Balance(u64) + Authority(Pubkey)
        seeds = [b"user-stats", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"user-stats", user.key().as_ref()],
        bump,
        has_one = authority // Ensure only the owner can withdraw
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserAccount {
    pub balance: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in escrow.")]
    InsufficientFunds,
}
