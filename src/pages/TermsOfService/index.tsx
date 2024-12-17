import React from "react";
import { TopTitle } from '@/shared/components/ui';

const TermsOfService: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            {/* 제목 */}
            <p className="text-xl font-semibold">Terms of Service</p><br />
            
            {/* 본문 내용 */}
            <div className="text-left w-full mt-4">

                <p className="text-base font-semibold mt-6 underline">Last Update: Nov 25th, 2024</p><br /><br />
                <p className="text-base font-semibold mt-6">Welcome to LUCKY DICE!</p><br /><br />
                <p className="text-base">
                    LUCKY DICE (“the Company”) is an NFT-based game focused on animal health diagnostics powered by medical AI. 
                    It is owned and operated by SAVE THE LIFE FOUNDATION. These Terms of Service (“Terms”) govern your access to and use of the website(s), 
                    our APIs, mobile app (the “App”), the NFTs issued by the Company are used as functional tools for accessing AI services and as in-game items, 
                    while the SL Tokens offered in the game are presented as rewards.<br /><br />

                    AS SUCH THIS LUCKY DICE GAMES NFT AND THE SAVETHELIFE (SL) TOKEN (AS DEFINED BELOW) ARE NOT INTENDED TO CONSTITUTE, 
                    AND SHOULD NOT BE CONSTRUED AS A CAPITAL MARKETS PRODUCT (INCLUDING SECURITIES AND/OR UNITS IN A COLLECTIVE INVESTMENT SCHEME OR UNITS.)<br /><br />

                    PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT INFORMATION AND AFFECT YOUR LEGAL RIGHTS. 
                    Please note that these terms of service include a mandatory arbitration agreement and class action waiver 
                    which require any disputes between us to be resolved through individual arbitration rather than by a judge or jury in court.<br /><br />

                    BY CLICKING TO ACCEPT AND/OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS AND ALL OF THE TERMS INCORPORATED HEREIN BY REFERENCE. 
                    IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR USE THE SERVICE.<br /><br />
                </p>

                
                {/* Article 1 */}
                <p className="text-base font-semibold mt-6">Article 1 Purpose</p><br />
                <p className="text-base">
                    The purpose of these Terms and Conditions is to set forth the rights, obligations, responsibilities, 
                    and other matters concerning the procedures for using the services provided by SAVE THE LIFE FOUNDATION (“the Company”) 
                    by Members subscribing to and utilizing the “Services.”<br />
                </p><br />


                {/* Article 2 */}
                <p className="text-base font-semibold mt-6">Article 2 Privacy Policy</p><br />
                <p className="text-base">
                    Please refer to the Privacy Policy for information on how the company collects, uses, and shares your privacy.<br /> 
                </p><br />

                {/* Article 3 */}
                <p className="text-base font-semibold mt-6">Article 3 Definition</p><br />
                <p className="text-base">
                    1. The term “Site” means a virtual business site or service space where the Company is allowed to trade property rights using information 
                    and communication facilities such as computers to provide Services to the members. 
                    It will refer to the following sites where Member can use the Services using the account of the Member (ID and Password).<br /><br /> 
                    2. “NFT” in these Terms means a non-fungible token or similar digital item implemented on a blockchain (such as the Ethereum blockchain), 
                    which uses smart contracts to link to or otherwise be associated with certain content or data.<br /><br />
                    3. The term “Member” means a person who enters into a use contract with the Company in accordance with these Terms 
                    and Conditions and uses the Services on the Site operated by the Company.<br /><br />
                    4. The term “ID” means a combination of letters and numbers determined by the Member and approved by the Company for identification 
                    and use of the Services of the Member.<br /><br />
                    5. The term “Password” means a combination of letters or numbers determined by the Member to confirm the identity of the Member 
                    with ID assigned by the Company and to protect the confidentiality of the Member.<br /><br />
                    6. The term “Termination” means that the Company or the Member terminates the validity of the use contract for the future.<br /><br />
                    7. The terms used in these Terms and Conditions but not defined in Article 3 hereof will have the meaning defined in the relevant laws 
                    and regulations as well as service-specific guidelines, and otherwise in accordance with general trade practices.<br /><br />
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;