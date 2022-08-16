import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import { Finalwhitelist } from "../target/types/finalwhitelist";

describe("finalwhitelist", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());
	const provider = anchor.AnchorProvider.env();
	const program = anchor.workspace.Finalwhitelist as Program<Finalwhitelist>;
	const wallet = provider.wallet;
	const seed = "nnnssntest";
	it("Is makes the whitelist!", async () => {
		// Add your test here.

		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const tx = await program.methods
			.createWhitelist(seed)
			.accounts({
				mainWhitelistingAccount: pda,
				authority: wallet.publicKey,
			})
			.rpc();
		console.log("Your transaction signature", tx);
	});

	it("Is adds to the whitelist!", async () => {
		// Add your test here.
		const key = Keypair.generate();
		console.log(key.publicKey.toString());
		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const mainWhitelistingAccount =
			await program.account.mainWhiteListingAccount.fetch(pda);
		console.log(mainWhitelistingAccount.counter);
		const [new_pda, _1] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const tx = await program.methods
			.addWallet(seed)
			.accounts({
				mainWhitelistingAccount: pda,
				whitelistedWallet: new_pda,
				authority: wallet.publicKey,
				user: key.publicKey,
			})
			.rpc();
		console.log("Your transaction signature", tx);
	});
	// 3LTZgMPHGwpdqLSzjDgytiGju9vF77dSzZqzKWrj9ckB
	it("Is removes a wallet from the whitelist!", async () => {
		// Add your test here.
		const key = new PublicKey("4nXukaNxuLWa1xPxae1Ymv6dW9tCpvvE24tBRUiHLYAG");

		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		// const mainWhitelistingAccount =
		// 	await program.account.mainWhiteListingAccount.fetch(pda);
		// console.log(mainWhitelistingAccount.counter);
		const [new_pda, _1] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const initBalance = await provider.connection.getBalance(wallet.publicKey);
		console.log(initBalance, "Before");
		const tx = await program.methods
			.removeWallet(seed)
			.accounts({
				mainWhitelistingAccount: pda,
				whitelistedWallet: new_pda,
				authority: wallet.publicKey,
				user: key,
			})
			.rpc();
		const finalyBlance = await provider.connection.getBalance(wallet.publicKey);

		console.log(finalyBlance, "Before");

		// console.log("Your transaction signature", tx);
	});
	// Ez6D95mQ3xH7oMuadimkjXYerb4Xmypcpukqi2Y6tJtg;
	it("Is edits a wallet from the whitelist!", async () => {
		// Add your test here.
		const key = new PublicKey("ERdDjMCmJZdkd1ajVfJ3AhcJuZZdEM9wyU766t3wM6fV");
		const newWallet = Keypair.generate();
		console.log(newWallet.publicKey.toString());
		const [new_pda1, _2] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				newWallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		// const mainWhitelistingAccount =
		// 	await program.account.mainWhiteListingAccount.fetch(pda);
		// console.log(mainWhitelistingAccount.counter);
		const [new_pda, _1] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const initBalance = await provider.connection.getBalance(wallet.publicKey);
		console.log(initBalance, "Before");
		const tx = await program.methods
			.editWallet(seed)
			.accounts({
				mainWhitelistingAccount: pda,
				whitelistedWallet: new_pda,
				authority: wallet.publicKey,
				user: key,
				newWlAccount: new_pda1,
				newUser: newWallet.publicKey,
			})
			.rpc();
		const finalyBlance = await provider.connection.getBalance(wallet.publicKey);

		console.log(finalyBlance, "Before");

		// console.log("Your transaction signature", tx);
	});

	it("Is makes multiple whitelists!", async () => {
		// Add your test here.
		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode("newSeeeed")),
			],
			program.programId,
		);
		const tx = await program.methods
			.createWhitelist("newSeeeed")
			.accounts({
				mainWhitelistingAccount: pda,
				authority: wallet.publicKey,
			})
			.rpc();
		// console.log("Your transaction signature", tx);
	});

	it("Access the whitelist accounts", async () => {
		// Add your test here.
		const key = new PublicKey("4nXukaNxuLWa1xPxae1Ymv6dW9tCpvvE24tBRUiHLYAG");
		const [new_pda, _1] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		const walletAccount = await program.account.wallet.fetch(new_pda);
		console.log(walletAccount.authority.toString(), key.toString());
		assert(walletAccount.authority.toString() == key.toString(), "done");
		// console.log("Your transaction signature", tx);
	});

	it("Checks to see if its whitelisted", async () => {
		// Add your test here.
		const key = new PublicKey("4nXukaNxuLWa1xPxae1Ymv6dW9tCpvvE24tBRUiHLYAG");

		const [pda, _] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		// const mainWhitelistingAccount =
		// 	await program.account.mainWhiteListingAccount.fetch(pda);
		// console.log(mainWhitelistingAccount.counter);
		const [new_pda, _1] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);

		const tx = await program.methods
			.checkWallet(seed)
			.accounts({
				mainWhitelistingAccount: pda,
				whitelistedWallet: new_pda,
				authority: wallet.publicKey,
				user: key,
			})
			.rpc();
		const key1 = new PublicKey("7iuqddUQJhger2p75SGV3MngZW6WEG6DDnW3U4yZHYWK");

		const [pda1, _2] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		// const mainWhitelistingAccount =
		// 	await program.account.mainWhiteListingAccount.fetch(pda);
		// console.log(mainWhitelistingAccount.counter);
		const [new_pda1, _3] = await PublicKey.findProgramAddress(
			[
				wallet.publicKey.toBuffer(),
				key1.toBuffer(),
				Buffer.from(anchor.utils.bytes.utf8.encode(seed)),
			],
			program.programId,
		);
		// try {
		// 	const tx1 = await program.methods
		// 		.checkWallet(seed)
		// 		.accounts({
		// 			mainWhitelistingAccount: pda1,
		// 			whitelistedWallet: new_pda1,
		// 			authority: wallet.publicKey,
		// 			user: key1,
		// 		})
		// 		.rpc();
		// } catch (error) {
		// 	console.log(error);
		// }
		// console.log("Your transaction signature", tx);
	});
});
