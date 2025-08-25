import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Banner from '@/components/common/BannerWithRightIcon';
import { PageSkeleton } from '@/components/common/PageSkeleton.jsx';
import SupportFAQ from '@/assets/icons/common/support_faq.svg';
import SupportQ from '@/assets/icons/common/support_q.svg';
import { getCommonQuestions, getPrivacyAndPolicy } from '@/services/support/supportApi';

const Support = () => {
    // Query for common questions
    const { data: commonQuestions, isLoading: isLoadingQuestions } = useQuery({
        queryKey: ['commonQuestions'],
        queryFn: getCommonQuestions,
        staleTime: 10 * 60 * 1000, // 10 minutes cache
    });

    // Query for privacy policy
    const { data: privacyPolicy, isLoading: isLoadingPolicy } = useQuery({
        queryKey: ['privacyPolicy'],
        queryFn: getPrivacyAndPolicy,
        staleTime: 10 * 60 * 1000, // 10 minutes cache
    });

    // Show skeleton while loading
    if (isLoadingQuestions || isLoadingPolicy) {
        return <PageSkeleton rows={4} />;
    }
    return (
        <div className='flex flex-col gap-8'>
            <Banner
                icon={SupportFAQ}
                title='سياسة الخصوصية و شروط الاستخدام'
                p_comp={privacyPolicy.counts.admin}
                p={privacyPolicy.counts.app}
                navigateTo="/support/privacy_policy"
                data={privacyPolicy.data}
            />
            <Banner
                icon={SupportQ}
                title='الأسئلة الشائعة'
                p_comp={commonQuestions.counts.admin}
                p={commonQuestions.counts.app}
                navigateTo="/support/faq"
                data={commonQuestions.data}
            />
        </div>
    );
}

export default Support;