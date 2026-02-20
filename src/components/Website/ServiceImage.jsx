import React from 'react';
import Image1 from "../../assets/images/image1.png";
import Image2 from "../../assets/images/image2.png";
import Image3 from "../../assets/images/image3.png";
import Image4 from "../../assets/images/image4.jpg";
import Image5 from "../../assets/images/image5.png";
import Image6 from "../../assets/images/image6.png";
import Image7 from "../../assets/images/image7.png";
import Image8 from "../../assets/images/image8.png";
import Image9 from "../../assets/images/image9.jpg";
import Image10 from "../../assets/images/image10.jpg";
// Images 11 and 12 were missing in the assets folder
import Image13 from "../../assets/images/image13.jpg";
import Image14 from "../../assets/images/image14.png";
import Image15 from "../../assets/images/image15.png";
import Image16 from "../../assets/images/image16.png";
import Image17 from "../../assets/images/image17.png";
import Image18 from "../../assets/images/image18.png";
import Image19 from "../../assets/images/image19.png";

const imageData = [

    // Missing: Google Scholar (11), Journals Directory (12)

    { src: Image1, title: "Infobase Index" },
    { src: Image2, title: "BASE" },
    { src: Image3, title: "Publons" },
    { src: Image4, title: "Scilit" },
    { src: Image5, title: "EuroPub" },
    { src: Image6, title: "JournalGuide" },
    { src: Image7, title: "Research Gate" },
    { src: Image8, title: "CiteFactor" },
    { src: Image9, title: "Directory of Research Journals Indexing" },
    { src: Image10, title: "sherpa" },
    { src: Image13, title: "ORCID" },
    { src: Image14, title: "CrossRef Metadata Search" },
    { src: Image15, title: "Research Bible - ResearchBib" },
    { src: Image16, title: "Indian Science" },
    { src: Image17, title: "ROAD - Directory of Open Access Scholarly Resources" },
    { src: Image18, title: "CrossRef" },
    { src: Image19, title: "Index Copernicus International" },
];

const ServiceImage = () => {
    return (
        <section class="services">
            <div class="container">
                <h2>
                    <strong>Index</strong> & Citations
                </h2>
                <ul >
                    {imageData?.length > 0 && imageData.map((item, index) => (
                        <li key={index}>
                            <img
                                src={item.src}
                                alt={item.title}
                                title={item.title}

                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default ServiceImage;