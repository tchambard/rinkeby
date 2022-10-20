import { assert } from 'chai';
import { BN } from '@openzeppelin/test-helpers';

import { AlyraERC20TokenInstance } from '../types/truffle/AlyraERC20Token';

const MyToken = artifacts.require('AlyraERC20Token');

contract('AlyraERC20Token', accounts => {
  const _name = 'Alyra'
  const _symbol = 'ALY' 
  const _initialSupply = 10000;
  const _owner = accounts[0];
  const _recipient = accounts[1];
  const _decimal = 18;

  let instance: AlyraERC20TokenInstance;

  beforeEach(async function(){
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
    let amount = BN(100);
    let balanceOwnerBeforeTransfer = await instance.balanceOf(_owner);
    let balanceRecipientBeforeTransfer = await instance.balanceOf(_recipient)

    assert.equal(balanceRecipientBeforeTransfer.toNumber(), 0);
    
    await instance.transfer(_recipient, BN(100), { from: _owner });

    let balanceOwnerAfterTransfer = await instance.balanceOf(_owner);
    let balanceRecipientAfterTransfer = await instance.balanceOf(_recipient)

    assert.equal(balanceOwnerAfterTransfer.toNumber(), balanceOwnerBeforeTransfer.sub(amount).toNumber());
    assert.equal(balanceRecipientAfterTransfer.toNumber(), balanceRecipientBeforeTransfer.add(amount).toNumber());
    
  });

});
