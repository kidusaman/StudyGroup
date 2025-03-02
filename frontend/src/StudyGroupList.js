// src/StudyGroupList.js
import React from 'react';
import { Link } from 'react-router-dom';

const predefinedGroups = [
  { id: 1, name: "Computer Science Colloquium" },
  { id: 2, name: "Computer Science I" },
  { id: 3, name: "Computer Science II" },
  { id: 4, name: "CSCI Elective" },
  { id: 5, name: "Computer Languages Python" },
  { id: 6, name: "Discrete Structures" },
  { id: 7, name: "Algorithms and Data Structures" },
  { id: 8, name: "Assembly and Computer Organization" },
  { id: 9, name: "Theory of Programming Languages" },
  { id: 10, name: "Introduction to Computer Systems" },
  { id: 11, name: "Compiler Design & Software Development" },
  { id: 12, name: "Software Engineering" },
  
  { id: 13, name: "Data Communication Networks" },
  { id: 14, name: "Neural Nets" },
  { id: 15, name: "Selected Topics in CSCI" }
];

function StudyGroupList({ token }) {
  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Study Groups</h2>
      {predefinedGroups.map((group) => (
        <div
          key={group.id}
          style={{
            padding: '15px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: '#fff'
          }}
        >
          <Link
            to={`/group-chat/${group.id}`}
            style={{ textDecoration: 'none', color: '#5151e5', fontSize: '18px' }}
          >
            {group.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default StudyGroupList;
