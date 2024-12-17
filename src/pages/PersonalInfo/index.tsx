import React from "react";
import { TopTitle } from '@/shared/components/ui';

const CollectingPersonalInfo: React.FC = () => {

    return (
        <div className="flex flex-col items-center bg-transparent text-white mx-6 min-h-screen">
            <TopTitle title="Policy" back={true} />

            <h1>Consent to Collection and Use of Personal Information</h1>
            <p className="text-sm"><br />
                <strong>Purpose of Collection and Use of Personal Information:</strong><br />
                Your email information is collected to deliver Newsletters. The collected
                personal information will not be used for any purpose other than the
                specified purpose, and in the event of any change in the purpose of the
                collection, you will be notified in advance for your consent.
            </p><br />

            <p className="text-sm">
                <strong>Personal Information Collected:</strong> Email
            </p><br />

            <p className="text-sm">
                <strong>Period of Use and Retention:</strong> 2 years
            </p><br />

            <p className="text-sm">
                <strong>Right to Refuse Consent:</strong><br />
                You have the right to refuse to consent to the collection and use of your
                personal data, and if you do not agree, you will not be able to receive the
                newsletter.
            </p><br />

            <p className="text-[#555] text-xs">
                This consent is required for newsletter subscription. Please read the
                information carefully before proceeding.
            </p>
        </div>
    );
};

export default CollectingPersonalInfo;