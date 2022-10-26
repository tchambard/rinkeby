import { assert } from 'chai';
import { BN, expectRevert, expectEvent } from '@openzeppelin/test-helpers';

import { SPAInstance } from '../types/truffle/SPA';

const SPA = artifacts.require('SPA');

//
contract.skip('SPA', accounts => {

  const _owner = accounts[0];
  const adopter1 = accounts[1];


  let instance: SPAInstance;

  beforeEach(async function(){
    instance = await SPA.new({ from: _owner });
  });

  context('> No animal available', () => {
    describe('> getAnimal', () => {
      it('> should revert', async () => {
        await expectRevert.unspecified(instance.getAnimal(0));
      });
    });

    describe('> deleteAnimal', () => {
      it('> should revert', async () => {
        await expectRevert.unspecified(instance.removeAnimal(0));
      });
    });

    describe('> setAnimal', () => {
      it('> should revert', async () => {
        await expectRevert(instance.setAnimal(0, 'elephant.unspecified', 3000, 20));
      });
    });

    describe('> addAnimal', () => {
      it('> should add new animal', async () => {
        await instance.addAnimal('elephant', 3000, 20);
        await expectEvent('NewAnimalAvailable', {
          id: BN(0),
          race: 'elephant',
          taille: BN(3000),
          age: BN(20),
        });

        const animal = await instance.getAnimal(0);
        assert.deepEqual(animal, {
          race: 'elephant',
          age: BN(20),
          taille: BN(3000),
          isAdopted: false,
        });
      });
    });


    describe('> adoptByCriteria', () => {
      it('> should revert', async () => {
        await expectRevert(instance.adoptByCriteria('elephant', 3000, 20), 'No animal matches with your criterias');
      });
    });

    describe('> adoptById', () => {
      it('> should revert', async () => {
        await expectRevert(instance.adoptById(0), 'No animal matches with your criterias');
      });
    });

    describe('> adoptedBy', () => {
      it('> should revert', async () => {
        await expectRevert.unspecified(instance.adoptedBy(adopter1));
      });
    });


  });

  context('> Many animals available', () => {

    beforeEach(async () => {
      await instance.addAnimal('elephant', 3000, 90);
      await instance.addAnimal('dog', 3000, 15);
      await instance.addAnimal('cat', 300, 10);
      await instance.addAnimal('cat', 200, 20);
      await instance.addAnimal('elephant', 2500, 20);
    });

    describe('> getAnimal', () => {
      it('> should revert', async () => {
        const cat = await instance.getAnimal(2);
        assert.deepEqual(cat, {
          race: 'cat',
          age: BN(15),
          taille: BN(300),
          isAdopted: false,
        })
      });
    });

    describe('> deleteAnimal', () => {
      it('> should delete', async () => {
        const dog = await instance.getAnimal(1);
        assert.isDefined(dog);
        await instance.removeAnimal(1);
        await expectRevert.unspecified(instance.getAnimal(1));
      });
    });

    // ......

  });


});
