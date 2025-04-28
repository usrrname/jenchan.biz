import React from 'react';
interface LinkCardProps {
    author?: string;
    title: string;
    image: string;
    description: string;
    date?: string;
    url: string;
}

const LinkCard: React.FC<LinkCardProps> = ({
    author,
    title,
    image,
    description,
    date,
    url,
}) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out !text-decoration-none">
            {image && <img src={image} className="w-full h-48 object-cover !m-0" loading="lazy" alt={`${title}`} />}
            <div className="p-4">
                <p className="text-lg font-semibold">{title}</p>
                {author && (
                    <p className="text-gray-600 text-sm mb-2">{author}</p>
                )}
                <p className="text-gray-600 text-sm mb-2">{description}</p>
                {date && (
                    <p className="text-gray-500 text-xs">{date}</p>
                )}
            </div>
        </a>
    );
};

export default LinkCard; 