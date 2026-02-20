import React from 'react';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';

// Importing images as requested
import image1 from '../../assets/images/image1.png';
import image2 from '../../assets/images/image2.png';
import image3 from '../../assets/images/image3.png';
import image4 from '../../assets/images/image4.jpg';
import image5 from '../../assets/images/image5.png';
import image6 from '../../assets/images/image6.png';
import image7 from '../../assets/images/image7.png';
import image8 from '../../assets/images/image8.png';
// Assuming image9 to image19 exist based on user input, though standard typically goes sequentially. 
// Given the user specifically mentioned "image1, image 2...", I will pattern match the content.
// However, the find results showed image1...image8, image14..image20.
// I will map the logical items to the available images or standard placeholders if gaps exist.
// Based on file search, we have image1-8, then image14-20.
// I'll try to map as best as possible or use a dynamic import if needed, but static is safer.
import image9 from '../../assets/images/image14.png'; // Fallback mapping based on available files
import image10 from '../../assets/images/image15.png';
import image11 from '../../assets/images/image16.png';
import image12 from '../../assets/images/image17.png';
import image13 from '../../assets/images/image18.png';
import image14 from '../../assets/images/image19.png';
import image15 from '../../assets/images/image20.png';
import image16 from '../../assets/images/pub.png';
import image17 from '../../assets/images/cross.jpg';
import image18 from '../../assets/images/18.jpg';
import image19 from '../../assets/images/19.jpg';
import image20 from '../../assets/images/20.png';
import image21 from '../../assets/images/21.png';
import image22 from '../../assets/images/22.png';
 // Reusing image1 for lack of more images


const JournalIndexing = () => {
    const indexingData = [
        {
            title: "Infobase Index",
            image: image9,
            desc: "INFOBASE INDEX is a source for the basic requirement of every researcher- 'relevant information'.InfoBase Index is a comprehensive, multipurpose database covering scholarly literature from all over the world.InfoBase Index indexes articles from all over the world, with the database growing every day. The result is an exhaustive database that assists research in every field."
        },
        {
            title: "BASE",
            image: image10,
            desc: "BASE is operated by Bielefeld University Library. BASE provides more than 150 million documents from more than 7,000 sources. Search engine for the mostly academic web resource."
        },
        {
            title: "Publons",
            image: image16,
            desc: "Publons was first built as a place to help researchers get recognition for their often hidden peer review contributions. To do this we partner with academic publishers to help them give their peer reviewers the recognition they deserve. Publons has a range of peer review solutions designed to help publishers bring greater transparency, recognition, quality, and efficiency to their peer review processes."
        },
        {
            title: "Scilit",
            image: image11,
            desc: "The name Scilit uses components of the words 'scientific' and 'literature'. This database of scholarly works is developed and maintained by the open access publisher MDPI. Scilit is a comprehensive, free database for scientists using a new method to collate data and indexing scientific material. Our crawlers extract the latest data from CrossRef and PubMed on a daily basis. This means that newly published articles are added to Scilit immediately."
        },
        {
            title: "EuroPub",
            image: image12,
            desc: "EuroPub is a comprehensive, multipurpose database covering scholarly literature, with indexed records from active, authoritative journals, and indexes articles from journals all over the world. The result is an exhaustive database that assists research in every field. Easy access to a vast database at one place, reduces searching and data reviewing time considerably and helps authors in preparing new articles to a great extent. EuroPub aims at increasing the visibility of open access scholarly journals, thereby promoting their increased usage and impact."
        },
        {
            title: "JournalGuide",
            image: image1,
            desc: "JournalGuide is a free tool created by a group of software developers, former researchers, and scholarly publishing veterans at Research Square. Our goal for JournalGuide is to bring all sources of data together in one place to give authors a simple way to choose the best journal for their research."
        },
        {
            title: "Research Gate",
            image: image2,
            desc: "ResearchGate is the professional network for scientists and researchers. Over 15 million members from all over the world use it to share, discover, and discuss research."
        },
        {
            title: "CiteFactor",
            image: image3,
            desc: "Citefactor is a service that provides access to quality controlled Open Access Journals. The Directory indexing of journal aims to be comprehensive and cover all open access scientific and scholarly journals that use an appropriate quality control system, and it will not be limited to particular languages or subject areas. The aim of the Directory is to increase the visibility and ease of use of open access scientific and scholarly journals thereby promoting their increased usage and impact."
        },
        {
            title: "Directory of Research Journals Indexing",
            image: image4, // Using mapped image
            desc: "The Directory of Research Journal Indexing (DRJI) is to increase the visibility and ease of use of open access scientific and scholarly journals thereby promoting their increased usage and impact. DRJI supply champion has access to global-renowned content in all discipline areas including magazine and journal articles. We advocate, educate, and provide the central resource for indexing. DRJI encourages the participation of all persons, groups, and organizations interested in indexing and related methods of information retrieval."
        },
        {
            title: "sherpa",
            image: image5,
            desc: "SHERPA RoMEO is an online resource that aggregates and analyses publisher open access policies from around the world and provides summaries of self-archiving permissions and conditions of rights given to authors on a journal-by-journal basis. RoMEO is a Jisc service and has collaborative relationships with many international partners, who contribute time and effort to developing and maintaining the service."
        },
        {
            title: "Google Scholar",
            image: image6,
            desc: "provides a simple way to broadly search for scholarly literature. From one place, you can search across many disciplines and sources: articles, thesis, books, abstracts and court opinions, from academic publishers, professional societies, online repositories, universities and other web sites."
        },
        {
            title: "Journals Directory",
            image: image7,
            desc: "Journals Directory is an online connector that ends the search of every academic author or research candidate, who is looking for a suitable journal. With succinct details about the journals and their publishers, it is one-stop-shop for members of the academia."
        },
        {
            title: "ORCID",
            image: image8,
            desc: "is an open registry that maintains unique identifiers and provides an online system for linking research information with their identifiers.The ORCID Registry is freely available online to individuals, who have an ORCID identifier. ELK Asia Pacific Journal is also a member with an ORCID identifier as: http://orcid.org/0000-0001-7679-970X."
        },
        {
            title: "CrossRef Metadata Search",
            image: image17,
            desc: "is a large database of 68 million journal titles, DOIs, ISSNs, books, reports, etc., which is widely accessed search domain by members of academia."
        },
        {
            title: "Research Bible - ResearchBib",
            image: image18,
            desc: "Research Bible is a database which archives various academic resources including journals, articles and research conferences."
        },
         {
            title: "Indian Science",
            image: image19,
            desc: "is an initiative for development and growth of scientifically research information and resources. It attempts to bring together science research community members and academicians to share and develop new ideas and concepts."
        },
        {
            title: "ROAD - Directory of Open Access Scholarly Resources",
            image: image20,
            desc: "is an open online directory of academic journals to benefit researchers and scholars in getting access to scholarly content via single point. The data is sourced through different sources such as ISSN Register, Scopus, DOAJ, EconLit and The Keepers Registry."
        },
         {
            title: "CrossRef",
            image: image21,
            desc: "is an official Digital Object Identifier (DOI) registration agency of the International DOI Foundation (www.doi.org). Being a member with them (Membership ID: 10.16962), we at ELK Asia Pacific Journals issue unique and persistent DOI for each published article. DOIs continue to link to the original resource, even if the content moves or URL changes"
        },
         {
            title: "Index Copernicus International",
            image: image22,
            desc: "The Index Copernicus is a scientific journal database, which generates the IC Journals Master List. It is an international platform for promoting scientific research with a base objective to collaborate national and international scientists and publishers."
        }

    ];

    return (
        <>
            <SEO 
                title="Journal indexing, International Indexes - ELK Asia Pacific Journals"
                description="We help scholars increase citation of their paper by indexing our journals at Google Scholar and other journal directories. Contact us for journal paper indexing"
            />
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-wrap">
                <div className="w-full lg:w-3/4">
                    <div className="">
                        <h1 className="text-2xl text-[#12b48b] font-normal mb-2 relative inline-block">
                            Journal Indexing
                        </h1>

                        <div className="space-y-6 mt-6">
                            {indexingData?.length > 0 && indexingData.map((item, index) => (
                                <div key={index} className="bg-[#f5f5f5] border border-gray-200 px-4 pt-4 rounded-sm">
                                    <div className="flex flex-col">
                                        {/* Alternating Header Logic */}
                                        <div className={`w-full mb-2 border-b border-dotted border-gray-400 pb-2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                            <h2 className="text-[#555] text-lg font-normal uppercase tracking-wider">{item.title}</h2>
                                        </div>

                                        <div className={`flex flex-col md:flex-row gap-4 items-start ${index % 2 === 0 ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'}`}>
                                            {/* Image */}
                                            <div className="w-full md:w-1/3 flex justify-center md:block">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className={`max-w-full h-auto ${index % 2 === 0 ? 'float-right' : 'float-left'}`}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="w-full md:w-2/3">
                                                <p className="text-sm text-[#555] leading-relaxed text-justify">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <div className="w-full lg:w-1/4 mt-8 lg:mt-0 lg:pl-6">
                    <NewsWidget />
                </div>
            </div>
        </div>
        </>
    );
};

export default JournalIndexing;