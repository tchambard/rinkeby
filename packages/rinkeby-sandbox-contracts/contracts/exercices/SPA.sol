// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;
 
contract SPA {

    struct Animal {
        string race;
        uint taille;
        uint age;
        bool isAdopted;
    }

    Animal[] public animals;

    mapping(address => uint) public masters;

    event NewAnimalAvailable(uint id, string race, uint taille, uint age);

    event AnimalDied(uint id);

    event AnimalAdopted(uint id);

    function addAnimal(string calldata _race, uint _taille, uint _age) external {
        animals.push(Animal(_race, _taille, _age, false));
        emit NewAnimalAvailable(animals.length - 1, _race, _taille, _age);
    }

    function removeAnimal(uint animalId) external {
        delete animals[animalId];
        emit AnimalDied(animalId);
    }

    function getAnimal(uint id) external view returns (Animal memory) {
        return animals[id];
    }

    function setAnimal(uint id, string calldata _race, uint _taille, uint _age) external {
        animals[id].race = _race;
        animals[id].taille = _taille;
        animals[id].age = _age;
    }

    function adoptByCriteria(string calldata _race, uint _taille, uint _age) external {
        
        for (uint i = 0; i < animals.length; i++) {
            if (animals[i].isAdopted == false && keccak256(abi.encodePacked(animals[i].race)) == keccak256(abi.encodePacked(_race)) && animals[i].taille < _taille && animals[i].age < _age) {
                masters[msg.sender] = i;
                emit AnimalAdopted(i);
                break;
            }
        }
        revert('No animal matches with your criterias');
    }

    function adoptById(uint id) external {
        require(animals[id].isAdopted == false, 'Animal already adopted');
        masters[msg.sender] = id;
        emit AnimalAdopted(id);
    }

    function adoptedBy(address master) external view returns (Animal memory) {
        return animals[masters[master]];
    }


}
