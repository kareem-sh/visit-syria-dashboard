import React from 'react';
import Banner from '@/components/common/BannerWithRightIcon'
import SupportFAQ from '@/assets/icons/common/support_faq.svg'
import SupportQ from '@/assets/icons/common/support_q.svg'
import { useNavigate, useParams } from 'react-router-dom';

const Support = () => {
     const navigate = useNavigate();

    const handleNavigation = (type) => {
            navigate(``);
    }
    return (
        <div className='flex flex-col gap-8'>
            <Banner icon={SupportFAQ} title='سياسة الخصوصية و شروط الاستخدام' p_comp="5" p="10" navigateTo="/support/faq"/>
            <Banner icon={SupportQ} title='الأسئلة الشائعة' p_comp="5" p="10" navigateTo="/support/q"/>
        </div>
    );
}

export default Support;
