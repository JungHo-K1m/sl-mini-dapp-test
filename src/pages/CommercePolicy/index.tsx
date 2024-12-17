import React from "react";
import { TopTitle } from '@/shared/components/ui';

const ElectronicCommercePolicy: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            {/* 본문 내용 */}
            <div className="text-left w-full mt-4">
                <p className="text-xl font-semibold">Electronic Commerce Policy</p><br />

                {/* Article 1 */}
                <p className="text-base font-semibold mt-6">Article 1: Purpose</p><br />
                <p className="text-base">
                    This Electronic Commerce Policy applies to the rights, duties, responsibilities, and other necessary matters between Lucky Dice
                    (hereinafter the “Company”) and those Lucky Dice members who agreed to the Terms of Service provided by Lucky Dice (hereinafter “Member”).
                </p><br />

                {/* Article 2 */}
                <p className="text-base font-semibold mt-6">Article 2 Definition</p><br />
                <p className="text-base">1. The terms used in this policy are defined as below.</p><br />
                <div className="text-base ml-2">
                    <p>
                        ① The term "Electronic Commerce services” refers to all services provided by the Company when the Member purchases 
                        goods or services from the Lucky Dice (hereinafter “purchase”).<br />
                        ② The term “Member” refers to a person who uses the Lucky Dice platform and its services, that enters into an 
                        electronic service use contract with the Company in accordance with the Article 5 of this Policy.<br />
                        ③ The term “Digital Asset” refers to digital technology based products such as images and videos, etc. created by Lucky Dice or an artist. 
                        The buyer of the digital asset received the rights of the purchased asset, and the details are according to this policy.<br />
                        ④ The term “NFT (Non-Fungible Token)” refers to a blockchain-based “Digital Assets” such as images and videos that is issued holding its metadata information, 
                        and grants specific rights (NFT owner rights) to the NFT owner.
                        Lucky Dice is recognized as granting the right to use AI features and provides the functionality of game items.
                        The NFT owner receives certain rights to the digital asset and the rights to transfer with regards to the held NFTs.
                        The details shall be in accordance with this policy.<br /><br />
                    </p>
                </div>
                
                <p className="text-base">
                    2. The terms used in these Policy not defined in Article 2 hereof will have the meaning defined in the Lucky Dice terms of service, 
                    relevant laws and regulations as well as service-specific guidelines, and otherwise in accordance with general trade practices. 
                </p><br />
                
                {/* Article 3 */}
                <p className="text-base font-semibold mt-6">Article 3 Notice and Amendment of the Policy</p><br />
                <p className="text-base">
                    1. The Company will post this policy on the service page of the website, a pop-up screen, or through a hyperlinked page, 
                    so that the Member can easily access it. <br />
                    2. The Company may amend this policy to the extent that does not violate the relevant laws, such as Act on Consumer Protection in 
                    Electronic Commerce, etc., Act on the Regulation of Terms and Conditions, Act on Promotion of Information and Communications Network Utilization 
                    and Data Protection, etc., and Electronic Commerce Law. <br />
                    3. In the case of amendment, the Company will post notice on the amendment from thirty (30) days before the enforcement date to the previous date 
                    of enforcement, stating the date of enforcement and reasons in accordance with Article 3,1. However, in the case of an amendment unfavorable to the Member, 
                    the Company will notify this to the Member via electronic means, such as E-mails, with the grace period, extra to the thirty (30) days of notice period.<br />
                    4. Upon posting or notifying the Member of the amendment as set forth in the previous Paragraph, even if the Company clearly notifies the Member of 
                    the fact that if the Member does not express one's intention within the thirty (30) days, then the Member will be deemed to have consented to the amendment, 
                    if the Member fails to clearly express one's rejection, the Member will be deemed to have consented to the amendment.<br />
                    5. If the Member does not agree to the amendment, then the amended policy may not be applied to the Member by the Company, 
                    and in this case, the Member may terminate the Service contract. However, if there are specific circumstances that the existing policy cannot be applied, 
                    the Company may terminate the Service contract.<br />
                </p><br />

                {/* Article 4 */}
                <p className="text-base font-semibold mt-6"> Article 4 Relations with Applicable Laws and Regulations</p><br />
                <p className="text-base">
                    1. The Company may set and operate individual terms and conditions or policies for matters applicable to specific services, 
                    if necessary, and the contents will be notified through the website etc. <br />
                    2. The matters not specified in this Policy will be governed by the provision of the relevant laws and regulations, 
                    such as Act on Consumer Protection in Electronic Commerce, etc., Act on the Regulation of Terms and Conditions, 
                    Act on Promotion of Information and Communications Network Utilization and Data Protection, etc., Electronic Commerce Law, and Terms of Service.<br />
                    3. The Member must keep attention to any changes in the Term of Service or the Policy and must check the changes when there are notices of the amendments. <br />
                </p>

                {/* Article 5 */}
                <p className="text-base font-semibold mt-6">Article 5 E-Commerce Service Contract</p><br />
                <p className="text-base">
                    1. The E-Commerce Service Contract becomes effective once the entity wishing to make the purchase (hereinafter “buyer”) specifies the items requested 
                    by the Company, agrees to the policy, and makes the offer, then the Company accepts this offer. At this time, in the purchase process, purchase 
                    completed comment is shown. <br />
                    2. In principle, the Company accepts the purchase offer in accordance with the preceding clause. However, in the case of the following, 
                    the Company may reject the offer or terminate the service contract hereafter. <br />
                </p>
                <div className="text-base ml-2">
                    <p>
                        ① The buyer is not a Member of the Lucky Dice service (hereafter “Lucky Dice”), provided by Lucky Dice <br />
                        ② Using the unverified ID<br />
                        ③ The Member has previously lost Lucky Dice service membership or the service contract has been terminated due to a 
                        violation of any Lucky Dice policies, such as this policy or Terms of service policy. <br />
                        ④ Not using the real name, or is using another entity's name. <br />
                        ⑤ False information is entered, or the required information is not provided, etc. <br />
                        ⑥ The offer is from the entity under the age of 19. <br />
                        ⑦ A suspended Member arbitrarily terminates the existing contract and reapplies during the suspension of use period. <br />
                        ⑧ The offer is in violation of the matters set by the Company or is an unacceptable offer due to reasons attributable to the member.  <br />
                        ⑨ Other cases where it is found to be a violation of this policy or is an illegal or unreasonable application. <br />
                    </p>
                </div>
                <p className="text-base">
                    3. The Company may request real name verification and identity verification through a 
                    specialized institution, in the application pursuant to Article 5,1. <br />
                    4. The Company may withhold approval if there is no room for service-related facilities or if there is a technical or business problem. <br />
                    5. In principle, if the Company does not accept or reserve the purchase offer in accordance with this article, 
                    the purchase is notified if there is no unavoidable reason. <br />
                </p>


                {/* Article 6 */}
                <p className="text-base font-semibold mt-6">Article 6 Termination, Cancellation, etc. of Service Use Contract </p><br />
                


            </div>
        </div>
    );
};

export default ElectronicCommercePolicy;