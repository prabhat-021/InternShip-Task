import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import "./about.css";

export default function About() {
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/prabhat-021/InternShip-Task/main/README.md')
            .then(response => response.text())
            .then(text => setContent(text))
            .catch(error => console.error('Error loading markdown:', error));
    }, []);

    return <div className="markdown-body">
        <Markdown>{content}</Markdown>
    </div>;
}