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
                <p className="text-base font-semibold mt-6">Article 1 Purpose</p><br />
                <p className="text-base">
                    This Electronic Commerce Policy applies to the rights, duties, responsibilities, and other necessary matters between Lucky Dice
                    (hereinafter the “Company”) and those Lucky Dice members who agreed to the Terms of Service provided by Lucky Dice (hereinafter “Member”).
                </p><br />

                {/* Article 2 */}
                <p className="text-base font-semibold mt-6">Article 2 Definition</p><br />
                <p className="text-base">1. The terms used in this policy are defined as below.</p><br />
                <div className="text-base ml-3">
                    <p>
                        ① The term "Electronic Commerce services” refers to all services provided by the Company when the Member purchases 
                        goods or services from the Lucky Dice (hereinafter “purchase”).<br /><br />
                        ② The term “Member” refers to a person who uses the Lucky Dice platform and its services, that enters into an 
                        electronic service use contract with the Company in accordance with the Article 5 of this Policy.<br /><br />
                        ③ The term “Digital Asset” refers to digital technology based products such as images and videos, etc. created by Lucky Dice or an artist. 
                        The buyer of the digital asset received the rights of the purchased asset, and the details are according to this policy.<br /><br />
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
                    so that the Member can easily access it. <br /><br />
                    2. The Company may amend this policy to the extent that does not violate the relevant laws, such as Act on Consumer Protection in 
                    Electronic Commerce, etc., Act on the Regulation of Terms and Conditions, Act on Promotion of Information and Communications Network Utilization 
                    and Data Protection, etc., and Electronic Commerce Law. <br /><br />
                    3. In the case of amendment, the Company will post notice on the amendment from thirty (30) days before the enforcement date to the previous date 
                    of enforcement, stating the date of enforcement and reasons in accordance with Article 3,1. However, in the case of an amendment unfavorable to the Member, 
                    the Company will notify this to the Member via electronic means, such as E-mails, with the grace period, extra to the thirty (30) days of notice period.<br /><br />
                    4. Upon posting or notifying the Member of the amendment as set forth in the previous Paragraph, even if the Company clearly notifies the Member of 
                    the fact that if the Member does not express one's intention within the thirty (30) days, then the Member will be deemed to have consented to the amendment, 
                    if the Member fails to clearly express one's rejection, the Member will be deemed to have consented to the amendment.<br /><br />
                    5. If the Member does not agree to the amendment, then the amended policy may not be applied to the Member by the Company, 
                    and in this case, the Member may terminate the Service contract. However, if there are specific circumstances that the existing policy cannot be applied, 
                    the Company may terminate the Service contract.<br />
                </p><br />

                {/* Article 4 */}
                <p className="text-base font-semibold mt-6"> Article 4 Relations with Applicable Laws and Regulations</p><br />
                <p className="text-base">
                    1. The Company may set and operate individual terms and conditions or policies for matters applicable to specific services, 
                    if necessary, and the contents will be notified through the website etc. <br /><br />
                    2. The matters not specified in this Policy will be governed by the provision of the relevant laws and regulations, 
                    such as Act on Consumer Protection in Electronic Commerce, etc., Act on the Regulation of Terms and Conditions, 
                    Act on Promotion of Information and Communications Network Utilization and Data Protection, etc., Electronic Commerce Law, and Terms of Service.<br /><br />
                    3. The Member must keep attention to any changes in the Term of Service or the Policy and must check the changes when there are notices of the amendments. <br /><br />
                </p>

                {/* Article 5 */}
                <p className="text-base font-semibold mt-6">Article 5 E-Commerce Service Contract</p><br />
                <p className="text-base">
                    1. The E-Commerce Service Contract becomes effective once the entity wishing to make the purchase (hereinafter “buyer”) specifies the items requested 
                    by the Company, agrees to the policy, and makes the offer, then the Company accepts this offer. At this time, in the purchase process, purchase 
                    completed comment is shown. <br /><br />
                    2. In principle, the Company accepts the purchase offer in accordance with the preceding clause. However, in the case of the following, 
                    the Company may reject the offer or terminate the service contract hereafter. <br />
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① The buyer is not a Member of the Lucky Dice service (hereafter “Lucky Dice”), provided by Lucky Dice <br /><br />
                        ② Using the unverified ID<br /><br />
                        ③ The Member has previously lost Lucky Dice service membership or the service contract has been terminated due to a 
                        violation of any Lucky Dice policies, such as this policy or Terms of service policy. <br /><br />
                        ④ Not using the real name, or is using another entity's name. <br /><br />
                        ⑤ False information is entered, or the required information is not provided, etc. <br /><br />
                        ⑥ The offer is from the entity under the age of 19. <br /><br />
                        ⑦ A suspended Member arbitrarily terminates the existing contract and reapplies during the suspension of use period. <br /><br />
                        ⑧ The offer is in violation of the matters set by the Company or is an unacceptable offer due to reasons attributable to the member.  <br /><br />
                        ⑨ Other cases where it is found to be a violation of this policy or is an illegal or unreasonable application. <br /><br />
                    </p>
                </div>
                <p className="text-base">
                    3. The Company may request real name verification and identity verification through a 
                    specialized institution, in the application pursuant to Article 5,1. <br /><br />
                    4. The Company may withhold approval if there is no room for service-related facilities or if there is a technical or business problem. <br /><br />
                    5. In principle, if the Company does not accept or reserve the purchase offer in accordance with this article, 
                    the purchase is notified if there is no unavoidable reason. <br /><br />
                </p>


                {/* Article 6 */}
                <p className="text-base font-semibold mt-6">Article 6 Termination, Cancellation, etc. of Service Use Contract </p><br />
                <p className="text-base">
                    1. Member may apply for termination of the use contract at any time, and the Company shall handle the matter immediately as stipulated by relevant laws.<br /> <br />
                    2. When a member terminates the use contract, the company deletes all the Member data immediately upon termination, except for the case of retaining 
                    member information in accordance with relevant laws and privacy policy.<br /><br />
                    3. The Member is responsible for any disadvantages caused by the termination of the use contract, and upon termination of the use contract, 
                    the Company may recover any free benefits previously provided for the Member. <br /><br />
                    4. The Company may terminate the use contract if any of the following reasons occurs or is found of the Member. <br />
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① When a Member acts or attempts to interfere with the smooth progress of the E-commerce service.<br /><br />
                        ② When a Member intentionally interferes with the business of the Company. <br /><br />
                        ③ When a Member infringes the rights, honor, credit or other legitimate interests of other members, 
                        or violates the laws of the Republic of Korea or social order and customs.<br /><br /> 
                        ④ When a Member violates this policy.<br /><br />
                        ⑤ When a Member acquires or uses the benefits provided by Lucky Dice by using another person's 
                        ID in a method not recognized by the Company or illegally. <br /><br />
                        ⑥ When a Member maliciously makes negative (-) deposits. <br /><br />
                        ⑦ When a Member is found to have a reason for refusal to accept the use contract set out in Article 6.<br /><br />
                        ⑧ When the Company deems it necessary to refuse the provision of services based on a reasonable judgement. <br /><br />
                        ⑨ When the Company terminates the contract of use, the Company shall notify the Member of the intention to terminate by E-mail, etc. 
                        In this case, the Company gives the Member an opportunity to file an objection by setting a reasonable period before the termination. 
                        However, if there is a reason stipulated in this policy and terms of service, the separate period for objection may not be granted.<br /><br />
                        ⑩ Even if the Company terminates the use contract, the already finalized terms and conditions prior to the termination continue to apply 
                        to the conclusion of the contract between the Member and the Company. <br /><br />
                        ⑪ The Company may refuse to accept the member's application for reuse if the contract of use is terminated by the Company. <br /><br />
                        ⑫ The member who is attributable to the reason for the termination of the use contract shall bear the responsibility for damages caused by 
                        the termination of the use contract, and the Company shall not be held liable unless there is a provision in the relevant laws and regulations.<br /><br />
                    </p>
                </div><br />

                {/* Article 7 */}
                <p className="text-base font-semibold mt-6">Article 7 Obligation of the Company</p><br />
                <p className="text-base">
                    1. The Company shall not engage in prohibited or illegal activities the relevant laws and tries its best effort to provide a continuous and stable E-commerce services. <br /><br /> 
                    2. The company shall have a security system to protect personal information (including credit information) so that Members can safely use 
                    E-commerce services and announces and complies with the privacy policy. <br /><br />
                    3. If the Company recognized that the opinions or complaints raised by Members in relation to the use of service are relevant and justified, they should be handled. 
                    The process of handling the relevant opinions or complaints shall be communicated to the Member via emails, etc. <br /><br />
                </p>

                {/* Article 8 */}
                <p className="text-base font-semibold mt-6">Article 8 Obligation of the Members</p><br />
                <p className="text-base">
                    1. Before making the purchase, the Member must thoroughly check the details and conditions of the digital asset. 
                    The Member shall be responsible for any losses and damages incurred due to the purchase made without checking the details and 
                    conditions of the digital asset. <br /><br />
                    2. Member must comply with this policy, and is responsible for any loss and damages caused by violation or not fulfilling the policy and notices. <br /><br />
                    3. Member must make the purchase at their own risk.<br /><br />
                    4. If a dispute arises in the transaction procedure with the Company, the Member shall faithfully cooperate for the resolution of the dispute, 
                    and the loss and damage incurred due to the Member's negligence of the dispute resolution shall be borne by the Member. <br /><br />
                    5. Member must use their own payment method when making a transaction, and must not arbitrarily use another person's payment method. 
                    The Member is responsible for any losses and damages, incurred by arbitrarily using another person's payment method, of the Company, 
                    the legal owner of the payment method, the electronic payment service provider.<br /><br />
                    6. Member is responsible for the information entered by the Member in relation to the payment of the product and services, 
                    and bear the responsibilities and disadvantages incurred in relation to this information.  <br /><br />
                    7. When making a payment, a Member must use a legitimate payment method and have the right to use this method. The Company may check this legitimacy 
                    and may suspend the transaction or cancel the transaction until the verification of the legitimacy of the member's payment method is completed.  <br /><br />
                    8. Member must cooperate with the Company so that the Company can safely provide the E-commerce services. 
                    Member must actively comply to the Company's request when the Company discovers a Member's violation of the policy and requests the Memer for explanation.<br /><br />   
                    9. Even if the Company provides information or contents for a reference within the E-commerce service site or in a link method in a manner 
                    provided by a third-party or receives information from an affiliate for the convenience of the Member's use of the E-commerce service, 
                    the Member must purchase the product at its own discretion and responsibility, and the Company may not be responsible for the Member's purchase decisions. <br /><br />
                </p>

                {/* Article 9 */}
                <p className="text-base font-semibold mt-6">Article 9 Prohibited Activity of the Members </p><br />
                <p className="text-base">
                    1. The Company prohibits the following activities to enhance the reliability of the E-commerce service and ensure safe transactions. 
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① Using the E-commerce service or accessing the system in an abnormal way other than the method provided by the Company. <br /><br />
                        ② Acts of using the E-commerce service provided by the Company with a stolen identity, another person's name, card information, account information and etc.  <br /><br />
                        ③ Unauthorized change of information posted by the Company or transmission or posting of information (including computer programs, etc.) other than the information provided by the Company. <br /><br />
                        ④ Infringement of the intellectual property rights of the Company and other third-parties.  <br /><br />
                        ⑤ Activities that damage the reputation or interfere with the business of the Company and other third-parties<br /><br />
                        ⑥ Repeated purchases without intention to purchase. <br /><br />
                        ⑦ Other illegal or unfair acts.<br /><br />
                    </p>
                </div>
                <p className="text-base">
                    2. The Company may restrict the use of the E-commerce services if the Member commits the prohibited activities of this Article, 
                    and the Member shall bear the responsibilities arising in this case. The Company may notify the relevant government or judicial authorities of the Member's prohibited acts, if necessary.<br /><br /> 
                    3. Member cannot engage in any of the following in relation to the digital assets and NFTs distributed and displayed in the Lucky Dice platform.<br /><br />
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① Uploading the digital assets with change or distortion to it.<br /><br />
                        ② Acts of using the digital assets for profit.<br /><br />
                        ③ Issuing a separate NFT in relation to the digital assets.<br /><br />
                        ④ Registering and acquiring separate intellectual property rights and other rights by abusing the “rights of the digital asset owner” and “rights of the NFT owner” of the digital assets. <br /><br /> 
                        ⑤ Disturbing the market, such as repeatedly trading the digital assets by collusion with specific members.<br /><br /> 
                    </p>
                </div>

                
                {/* Article 10 */}
                <p className="text-base font-semibold mt-6">Article 10 Restriction on E-Commerce services, etc.</p><br />
                <p className="text-base">
                    1.  The Company may suspend the Member's use of the E-commerce service or terminate the contract of use in the event of any of the following. 
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① If it falls under Article 9 of this policy. <br /><br /> 
                        ② If the Lucky Dice membership is suspended or lost.<br /><br /> 
                        ③ If this policy or the Lucky Dice's Terms of service policy has been violated. <br /><br /> 
                        ④ When there is a court order, such as seizure or provisional attachment of the Member, 
                        or when a request for suspension of use is received from an institution with investigative authority.<br /><br /> 
                    </p>
                </div>
                <p className="text-base">
                    2. Member whose use of the E-commerce service has been suspended cannot use the E-commerce service during the suspension period.<br /><br />  
                    3. The Company may resolve the Member's suspension of use if the Member meets the criteria set by the Company, 
                    such as by explaining the reasons or stating that the counterparty has consented to such activity. <br /><br /> 
                </p>


                {/* Article 11 */}
                <p className="text-base font-semibold mt-6">Article 11 Privacy Policy</p><br />
                <p className="text-base">
                    1. The Company implements a privacy policy to protect the Member's personal information and is obligated to protect the Member's personal information accordingly. 
                    The Company's Privacy Policy can be viewed on the service interface.<br /><br /> 
                </p>
                
                {/* Article 12 */}
                <p className="text-base font-semibold mt-6">Article 12 Return/Refund/Cancellation </p><br />
                <p className="text-base">
                    1. Returns, refunds, and cancellation of the NFTs, purchased on its first face value, directly purchased by the Member himself/herself, 
                    is processed in accordance with the current Consumer Protection Act in E-Commerce, etc., and does not apply to any gifted or airdropped NFTs.<br /><br />  
                    2. The request of refund or cancellation of the first face-value purchased NFT must be made within seven (7) days from the purchased 
                    or the received date of the NFT, and the refund is to be made in the same method as the payment (deposit, etc.) within seven (7) business days
                     from the date of the receipt of the cancellation by the Company, and the transaction fees of this process shall be borne by the Member.<br /><br />  
                    3. In the case of the following, the Member cannot request return, refund, or cancellation of the NFTs. 
                </p>
                <div className="text-base ml-3">
                    <p>
                        ① When the NFT is revealed.<br /><br />  
                        ② When the NFT is gifted or air-dropped.<br /><br /> 
                        ③ When the product is lost or damaged due to reasons attributable to the Member.<br /><br /> 
                        ④ When the value of the product has been significantly decreased due to the Member's use or partial consumption of such product or services.
                        (In cases where the AI diagnostic feature is used with an NFT or as a game item) <br /><br />
                        ⑤ When a prior notice had been provided and the consent had been acquired from the consumer for a case where an irreversible 
                        critical damage is expected to the Company when the refund or cancellation takes place, or a return, refund, or cancellation is 
                        restricted by the relevant laws and regulations.<br /><br />     
                    </p>
                </div>
                
                {/* Article 13 */}
                <p className="text-base font-semibold mt-6">Article 13 Copyright Policy</p><br />
                <p className="text-base">
                    1. The Company shall establish and operate a guideline for copyright protection of the copyright holder in the E-commerce service, 
                    and Members must comply with the company's copyright guideline. <br /><br />
                    2. Copyright for the works and other intellectual property rights for the products and services created by the Company belongs to the Company.<br /><br /> 
                    3. Member is responsible for the activity of copying, selling, publishing, editing, displaying, transmitting, distributing, broadcasting, performing, 
                    or any other means without prior consent of the Company or the copyright holder, or allows a third-party use of the digital assets, 
                    digital work included in the NFTs, and information obtained by using the E-commerce services.<br /><br /> 
                </p>


                {/* Article 14 */}
                <p className="text-base font-semibold mt-6">Article 14 Rights of Digital Asset Owner</p><br />
                <p className="text-base">
                    1. Digital works serviced by Lucky Dice are copyrighted by Lucky Dice or have been granted the right to use by the individual 
                    artist of the work and are protected by the Copyright law. Owning a “digital asset” does not mean acquiring any rights, such as copyrights, 
                    in that digital work.<br /><br />
                    2. Members who have purchased the digital assets may only use the purchased digital works in its original form for personal and non-commercial purposes. 
                    Except for the display in the Lucky Dice website, the ownership of the NFTs does not include the third-party exhibition rights in both online 
                    and offline spaces, even for non-profitable or non-commercial use. In the case on infringement of this right, the responsibility lies with the Member 
                    himself/herself.<br /><br />
                    3. Members shall not reproduce, redistribute, sell, lease, rent, transfer, or otherwise grant re-use rights to third parties 
                    (including providing access to digital works) of the purchased digital assets.<br /><br />
                    4. Members must use the purchased digital assets as provided by Lucky Dice, and the digital works cannot be edited, modified, 
                    or be created into secondary works.<br /><br />
                </p>


                {/* Article 15 */}
                <p className="text-base font-semibold mt-6">Article 15 Rights of NFT Owner  </p><br />
                <p className="text-base">
                    1. A person who owns an NFT is given the right to use digital works linked to the NFT within 
                    a certain limit in accordance with the content of this Article. NFT does not mean intellectual property rights, including copyrights and trademarks, 
                    or specific rights such as portrait rights and commercialization rights (hereafter referred to as the “rights of the NFT owner”).<br /><br />
                    2. NFT owners can transfer NFTs (wallet transfers) to others. In this case, the Member who transferred the NFT can no longer exercise 
                    the "rights of the NFT owner". NFT owner's rights may not be guaranteed to those who have received NFTs in a way that is not officially 
                    recognized by the Company or in a way that violates related laws and regulations, and the Company does not bear any responsibility for this.<br /><br />
                </p>

                
                {/* Article 16 */}
                <p className="text-base font-semibold mt-6">Article 16 Suspension of E-commerce services </p><br />
                <p className="text-base">
                    1. In case of inevitable interruption of the supply of power and communications, as well as in the case of maintenance, 
                    inspection, expansion, replacement, and relocation of information and communication facilities, the Company shall provide 
                    a seven (7) day notification in advance and temporarily suspend the service. However, the circumstances make it impossible for a prior notice, 
                    the Company may make a post notice.<br /><br />
                    2. In case of a force majeure such as natural disasters, war, riots, terrorism, hacking, DDOS, etc., the Company shall immediately notify 
                    such fact to the Members, but in inevitable circumstances where a prior notice is not possible such as inoperability of information and 
                    communication facilities, the Company shall make a notice immediately after these circumstances are resolved.<br /><br /> 
                    3. In the case where the Company cannot continue the E-commerce service due to difficulties in normal business activities, 
                    such as bankruptcy or initiation of rehabilitation procedures, it may suspend the E-commerce services thirty (30) days from the date of 
                    notifying the member.<br /><br /> 
                    4. The Company makes every effort to resume the E-commerce service as soon as possible in the event of the occurrence of section 1 and 2 of this Article.<br /><br />
                </p>

                
                
                {/* Article 17 */}
                <p className="text-base font-semibold mt-6">Article 17 Indemnity of Company </p><br />
                <p className="text-base">
                    1. The Company is not responsible for any obstacles to the use of E-commerce services due to reasons attributable to the Member.<br /><br /> 
                    2. The Company is not responsible for any damages caused be a Member providing their personal information and account (ID and password), 
                    etc. to others or leakage due to the Member's negligence in managing their own personal information.<br /><br /> 
                    3. The Company is not responsible for and does not intervene in transactions made between the third parties and Members connected 
                    through the links and banners on the Company's E-commerce service screen. <br /><br />
                </p>

                
                {/* Article 18 */}
                <p className="text-base font-semibold mt-6">Article 18 Notice</p><br />
                <p className="text-base">
                    1. The Company may use electronic means such E-mail provided by the Member, Consent window when signing in, or Notices on the website.<br /><br />  
                    2. The Company may make notice on its website instead of providing individual notices to the Member. 
                    However, matters that have significant impact on the use of services shall be notified on the website 
                    as well as notifying Members with the means in Section 1 of this Article.<br /><br /> 
                    3. The Company is not responsible for any issues arising from the rejection of E-mails or errors in the E-mail address provided by the Member.<br /><br /> 
                </p>

                
                
                {/* Article 19 */}
                <p className="text-base font-semibold mt-6">Article 19 Governing Law and Jurisdiction</p><br />
                <p className="text-base">
                    1. The laws of the Republic of Korea shall be the governing law for matters related to this policy. <br /><br />
                    2. Lawsuits related to dispute between the company and members are brought to the governing court under the Civil Procedure Act.<br /><br />
                </p>

                
                {/* Article 20 */}
                <p className="text-base font-semibold mt-6">Article 20 Provisions applicable mutatis mutandis</p><br />
                <p className="text-base">
                    1. Matters not defined in Electronic Commerce Policy shall be governed by the Lucky 
                    Dice Terms of Service and Privacy Policy and related laws and regulations.<br /><br />
                </p>

                <p className="text-base mt-6">This policy is effective from December 10th, 2024.</p><br />

            </div>
        </div>
    );
};

export default ElectronicCommercePolicy;