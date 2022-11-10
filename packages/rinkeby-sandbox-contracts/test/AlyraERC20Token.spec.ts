import { assert, expect } from 'chai';
import { BN } from '@openzeppelin/test-helpers';

import { AlyraERC20TokenInstance } from '../types/truffle/AlyraERC20Token';

const MyToken = artifacts.require('AlyraERC20Token');

contract('AlyraERC20Token', (accounts) => {
	const _name = 'Alyra';
	const _symbol = 'ALY';
	const _initialSupply = 10000;
	const _owner = accounts[0];
	const _recipient = accounts[1];
	const _decimal = 18;

	let instance: AlyraERC20TokenInstance;

	beforeEach(async function () {
		instance = await MyToken.new(_initialSupply, { from: _owner });
	});

	it('has a name', async () => {
		assert.equal(await instance.name(), _name);
	});

	it('has a symbol', async () => {
		assert.equal(await instance.symbol(), _symbol);
	});

	it('has a decimal', async () => {
		assert.equal((await instance.decimals()).toNumber(), _decimal);
	});

	it('check first balance', async () => {
		assert.equal((await instance.balanceOf(_owner)).toNumber(), _initialSupply);
	});

	it('check balance after transfer', async () => {
		const amount = 100;
		const balanceOwnerBeforeTransfer = await instance.balanceOf(_owner);
		const balanceRecipientBeforeTransfer = await instance.balanceOf(_recipient);

		assert.equal(balanceRecipientBeforeTransfer.toNumber(), 0);

		await instance.transfer(_recipient, 100, { from: _owner });

		const balanceOwnerAfterTransfer = await instance.balanceOf(_owner);
		const balanceRecipientAfterTransfer = await instance.balanceOf(_recipient);

		assert.equal(
			balanceOwnerAfterTransfer.toNumber(),
			balanceOwnerBeforeTransfer.sub(BN(amount)).toNumber(),
		);
		assert.equal(
			balanceRecipientAfterTransfer.toNumber(),
			balanceRecipientBeforeTransfer.add(BN(amount)).toNumber(),
		);
	});

	it('check balance after approve', async () => {
		const amount = 100;
		const allowanceBeforeApprove = await instance.allowance(_owner, _recipient);

		assert.equal(allowanceBeforeApprove.toNumber(), 0);

		await instance.approve(_recipient, amount, { from: _owner });

		const allowanceAfterApprove = await instance.allowance(_owner, _recipient);
		assert.equal(allowanceAfterApprove.toNumber(), amount);
	});

	it('check transferFrom after approve', async () => {
		const amount = 100;

		await instance.approve(_recipient, amount);

		const balanceOwnerBeforeTransferFrom = await instance.balanceOf(_owner);
		const balanceRecipientBeforeTransferFrom = await instance.balanceOf(
			_recipient,
		);

		assert.equal(balanceOwnerBeforeTransferFrom.toNumber(), _initialSupply);
		assert.equal(balanceRecipientBeforeTransferFrom.toNumber(), 0);

		await instance.transferFrom(_owner, _recipient, amount, {
			from: _recipient,
		});

		const balanceOwnerAfterTransferFrom = await instance.balanceOf(_owner);
		const balanceRecipientAfterTransferFrom = await instance.balanceOf(
			_recipient,
		);

		assert.equal(balanceOwnerAfterTransferFrom.toNumber(), _initialSupply - 100);
		assert.equal(balanceRecipientAfterTransferFrom.toNumber(), 100);
	});
});
