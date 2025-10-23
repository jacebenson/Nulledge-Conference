// this will take a 
//    name: "CJ & The Duke",
//    website: "https://www.cjandtheduke.com",
//    logo: "/expoBooths/cjandtheduke.webp"
//});

interface ExpoBoothProps {
    name: string;
    website: string;
    logo: string;
}

const ExpoBooth: React.FC<ExpoBoothProps> = ({ name, website, logo }) => {
    return (
        <div className="expo-booth">
            <a href={website} target="_blank" rel="noopener noreferrer">
                <img src={logo} alt={`${name} logo`} />
                <h3>{name}</h3>
                <p>Visit Website</p>
            </a>
        </div>
    );
};

export default ExpoBooth;
