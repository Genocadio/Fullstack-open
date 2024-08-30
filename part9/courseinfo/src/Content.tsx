import React from 'react';
import { CoursePart } from './types'; // Adjust the import path as needed

interface ContentProps {
    courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
    return (
        <div>
            {courseParts.map(part => (
                <Part key={part.name} part={part} />
            ))}
        </div>
    );
};

const Part = ({ part }: { part: CoursePart }) => {
    switch (part.kind) {
        case "basic":
            return (
                <div>
                    <h3>{part.name}</h3>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Description: {part.description}</p>
                </div>
            );
        case "group":
            return (
                <div>
                    <h3>{part.name}</h3>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Group Projects: {part.groupProjectCount}</p>
                </div>
            );
        case "background":
            return (
                <div>
                    <h3>{part.name}</h3>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Description: {part.description}</p>
                    <p>Background Material: {part.backgroundMaterial}</p>
                </div>
            );
        case "special":
            return (
                <div>
                    <h3>{part.name}</h3>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Description: {part.description}</p>
                    <p>Requirements: {part.requirements.join(', ')}</p>
                </div>
            );
        default:
            return null; // Exhaustive type checking ensures this case won't be hit
    }
};

export default Content;
