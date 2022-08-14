use anchor_lang::prelude::*;

declare_id!("3oom7fwj5hhVWLVAbskjYX3RosCPmpM6N4nURyvp4apZ");

#[program]
pub mod finalwhitelist {
    use super::*;

    pub fn create_whitelist(ctx: Context<CreateWhitelist>, _seed: String) -> Result<()> {
        let main_whitlistingaccount = &mut ctx.accounts.main_whitelisting_account;
        main_whitlistingaccount.authority = ctx.accounts.authority.key();
        main_whitlistingaccount.counter = 0;
        Ok(())
    }
    pub fn add_wallet(_ctx: Context<AddWallet>, _seed: String) -> Result<()> {
        let wallet_account = &mut _ctx.accounts.whitelisted_wallet;
        wallet_account.authority = _ctx.accounts.user.key();
        let main_whitelisting_account = &mut _ctx.accounts.main_whitelisting_account;
        main_whitelisting_account.counter =
            main_whitelisting_account.counter.checked_add(1).unwrap();
        Ok(())
    }
    pub fn remove_wallet(_ctx: Context<RemoveWallet>, _seed: String) -> Result<()> {
        let main_whitelisting_account = &mut _ctx.accounts.main_whitelisting_account;
        main_whitelisting_account.counter =
            main_whitelisting_account.counter.checked_sub(1).unwrap();

        Ok(())
    }
    pub fn edit_wallet(_ctx: Context<EditWallet>, _seed: String) -> Result<()> {
        let new_wallet_account = &mut _ctx.accounts.new_wl_account;
        new_wallet_account.authority = _ctx.accounts.new_user.key();
        Ok(())
    }
    pub fn check_wallet(_ctx: Context<CheckWallet>, _seed: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct CreateWhitelist<'info> {
    #[account(init, seeds=[authority.key().as_ref(), seed.as_bytes()], payer=authority, bump, space=MainWhiteListingAccount::SPACE )]
    pub main_whitelisting_account: Account<'info, MainWhiteListingAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct AddWallet<'info> {
    #[account(mut, has_one=authority, seeds=[authority.key().as_ref(), seed.as_bytes()], bump)]
    pub main_whitelisting_account: Account<'info, MainWhiteListingAccount>,
    #[account(init, seeds=[authority.key().as_ref(), user.key().as_ref()], payer=authority, bump, space= Wallet::SPACE)]
    pub whitelisted_wallet: Account<'info, Wallet>,
    /// CHECK: Passing in the users pubkey as a seed to create the whitelist reference
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct RemoveWallet<'info> {
    #[account(mut, seeds=[authority.key().as_ref(), seed.as_bytes()], bump)]
    pub main_whitelisting_account: Account<'info, MainWhiteListingAccount>,
    #[account(mut, seeds=[authority.key().as_ref(), user.key().as_ref()], bump, close=authority)]
    pub whitelisted_wallet: Account<'info, Wallet>,
    /// CHECK: Passing in the users pubkey as a seed to create the whitelist reference
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct EditWallet<'info> {
    #[account(mut, seeds=[authority.key().as_ref(), seed.as_bytes()], bump)]
    pub main_whitelisting_account: Account<'info, MainWhiteListingAccount>,
    #[account(mut, seeds=[authority.key().as_ref(), user.key().as_ref()], bump, close=authority)]
    pub whitelisted_wallet: Account<'info, Wallet>,
    /// CHECK: Passing in the users pubkey as a seed to create the whitelist reference
    pub user: UncheckedAccount<'info>,
    /// CHECK: Passing in the users pubkey as a seed to create the whitelist reference
    pub new_user: UncheckedAccount<'info>,
    #[account(init, seeds=[authority.key().as_ref(), new_user.key().as_ref()], bump, space=Wallet::SPACE, payer=authority)]
    pub new_wl_account: Account<'info, Wallet>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct CheckWallet<'info> {
    #[account(mut, seeds=[authority.key().as_ref(), seed.as_bytes()], bump)]
    pub main_whitelisting_account: Account<'info, MainWhiteListingAccount>,
    #[account(mut, seeds=[authority.key().as_ref(), user.key().as_ref()], bump)]
    pub whitelisted_wallet: Account<'info, Wallet>,
    /// CHECK: Passing in the users pubkey as a seed to create the whitelist reference
    pub user: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
}
#[account]
pub struct MainWhiteListingAccount {
    pub authority: Pubkey,
    pub counter: u8,
}

#[account]
pub struct Wallet {
    pub authority: Pubkey,
}

impl MainWhiteListingAccount {
    pub const SPACE: usize = 8 + 32 + 8;
}
impl Wallet {
    pub const SPACE: usize = 8 + 32;
}
