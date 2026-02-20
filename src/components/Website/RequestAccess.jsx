import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaListUl } from "react-icons/fa";

export default function RequestAccess() {
    return (
        <section className="py-10 bg-white">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-light text-[#12b48b]">
                    Reputed Open Access Journals by{" "}
                    <span className="text-[#204066] font-bold">ELK</span> Asia Pacific Journals
                </h2>
            </div>

            <ul className="flex justify-center gap-6 mt-6 flex-wrap">
                <li>
                    <Link
                        to="/authors-guidelines"
                        className="flex items-center gap-2 bg-[#204066] text-white px-8 py-3 text-lg rounded-md hover:opacity-90 transition"
                    >
                        <FaExchangeAlt className="text-xl" />
                        Author's Guidelines
                    </Link>
                </li>

                <li>
                    <Link
                        to="/peer-review-process"
                        className="flex items-center gap-2 bg-[#204066] text-white px-8 py-3 text-lg rounded-md hover:opacity-90 transition"
                    >
                        <FaListUl className="text-xl" />
                        Peer Review Process
                    </Link>
                </li>
            </ul>
        </section>
    );
}
