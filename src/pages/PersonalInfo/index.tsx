import React from "react";
import { TopTitle } from '@/shared/components/ui';

const CollectingPersonalInfo: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            <div className="text-left w-full mt-4">
                <p className="text-xl font-semibold">Consent to Collection and Use of Personal Information</p>

                <p className="text-base font-semibold">Purpose of Collection and Use of Personal Information:</p>
                <p className="text-base">
                    Your email information is collected to deliver Newsletters. The collected
                    personal information will not be used for any purpose other than the
                    specified purpose, and in the event of any change in the purpose of the
                    collection, you will be notified in advance for your consent.
                </p><br />

                <p className="text-base">
                    <strong>Personal Information Collected:</strong> Email
                </p><br />

                <p className="text-base">
                    <strong>Period of Use and Retention:</strong> 2 years
                </p><br />

                <p className="text-base font-semibold">Right to Refuse Consent:</p>
                <p className="text-base font-light">
                    You have the right to refuse to consent to the collection and use of your
                    personal data, and if you do not agree, you will not be able to receive the
                    newsletter.
                </p><br />

                <p className="text-[#555] text-sm font-semibold">
                    This consent is required for newsletter subscription. Please read the
                    information carefully before proceeding.
                </p>
            </div>
        </div>
    );
};

export default CollectingPersonalInfo;