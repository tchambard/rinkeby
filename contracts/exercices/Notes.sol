// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';

contract Notes is Ownable {

    enum Subject {
        Math,
        Fr,
        Bio
    }

    struct Student {
        mapping(Subject => uint8[]) notes;
        bool exists;
    }

    mapping(Subject => address) teachers;

    mapping(string => Student) students;

    string[] studentNames;

    modifier onlyTeacher {
        require(msg.sender == teachers[Subject.Bio] || msg.sender == teachers[Subject.Math] || msg.sender == teachers[Subject.Fr], 'only teachers granted');
        _;
    }

    function registerTeacher(Subject _subject) external {
        require(teachers[_subject] == address(0), 'Teacher already registered');
        teachers[_subject] = msg.sender;
    }

    function addNote(string calldata _studentName, uint8 _note) external onlyTeacher {
        registerStudentIfNotExist(_studentName);

        Student storage student = students[_studentName];
        if (msg.sender == teachers[Subject.Bio]) {
            student.notes[Subject.Bio].push(_note);
        } else if (msg.sender == teachers[Subject.Math]) {
            student.notes[Subject.Math].push(_note);
        } else if (msg.sender == teachers[Subject.Fr]) {
            student.notes[Subject.Fr].push(_note);
        }
    }

    function setNote(string calldata _studentName, uint8 _note, uint8 _noteIndex) external onlyTeacher {
        registerStudentIfNotExist(_studentName);

        Student storage student = students[_studentName];
        if (msg.sender == teachers[Subject.Bio]) {
            student.notes[Subject.Bio][_noteIndex] = _note;
        } else if (msg.sender == teachers[Subject.Math]) {
            student.notes[Subject.Math][_noteIndex] = _note;
        } else if (msg.sender == teachers[Subject.Fr]) {
            student.notes[Subject.Fr][_noteIndex] = _note;
        }
    }

    function getNote(string calldata _studentName, Subject _subject, uint8 _noteIndex) external view returns (uint8) {
        return students[_studentName].notes[_subject][_noteIndex];
    }

    function getStudentSubjectAverage(string calldata _studentName, Subject _subject) public view returns (uint8) {
        Student storage student = students[_studentName];
        uint8 sum;
        for (uint8 i = 0; i < student.notes[_subject].length; i++) {
            sum += student.notes[_subject][i];
        }
        return sum / uint8(student.notes[_subject].length);
    }

    function getStudentAverage(string calldata _studentName) public view returns (uint8) {
        uint8 sum;
        uint8 notesCount;

        Student storage student = students[_studentName];

        for (uint8 i = 0; i < student.notes[Subject.Fr].length; i++) {
            sum += student.notes[Subject.Fr][i];
            notesCount++;
        }
        for (uint8 i = 0; i < student.notes[Subject.Math].length; i++) {
            sum += student.notes[Subject.Math][i];
            notesCount++;
        }
        for (uint8 i = 0; i < student.notes[Subject.Bio].length; i++) {
            sum += student.notes[Subject.Bio][i];
            notesCount++;
        }
        return sum / uint8(notesCount);
    }

    function getGlobalSubjectAverage(Subject _subject) public view returns (uint8) {
        uint8 sum;
        uint8 notesCount;

        for (uint8 i = 0; i < studentNames.length; i++) {
            Student storage student = students[studentNames[i]];
            for (uint8 j = 0; j < student.notes[_subject].length; j++) {
                sum += student.notes[_subject][j];
                notesCount++;
            }
        }
        return sum / uint8(notesCount);
    }

    function getGlobalAverage() public view returns (uint8) {
        uint8 sum;
        uint8 notesCount;

        for (uint8 i = 0; i < studentNames.length; i++) {
            Student storage student = students[studentNames[i]];
            for (uint8 j = 0; j < student.notes[Subject.Fr].length; j++) {
                sum += student.notes[Subject.Fr][j];
                notesCount++;
            }
            for (uint8 j = 0; j < student.notes[Subject.Math].length; j++) {
                sum += student.notes[Subject.Math][j];
                notesCount++;
            }
            for (uint8 j = 0; j < student.notes[Subject.Bio].length; j++) {
                sum += student.notes[Subject.Bio][j];
                notesCount++;
            }
        }
        return sum / uint8(notesCount);
    }

    function registerStudentIfNotExist(string calldata _studentName) private {
        if (!students[_studentName].exists) {
            studentNames.push(_studentName);
            students[_studentName].exists = true;
        }
    }

}