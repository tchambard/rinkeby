// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17.0;

contract People {

    struct Person {
        string name;
        uint age;
    }

    Person public moi;
    Person[] public persons;

    function modifyPerson(string memory _name, uint _age) public {
        moi.name = _name;
        moi.age = _age;
    }

    function add(string memory _name, uint _age) public {
        Person memory person = Person(_name, _age);
        persons.push(person);
    }

    function remove() public {
        persons.pop();
    }

}