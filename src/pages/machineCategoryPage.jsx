import React from "react";
import MachineCategoryForm from "../forms/machineCategoryForm";
import DefaultContent from "../containers/defaultContent";

const MachineCategoryPage = () => {
    const breadCrumbList = [
        {title: 'فرم‌ها', link: null},
        {title: 'دسته‌بندی ماشین‌آلات', link: null},
        {title: 'افزودن دسته‌بندی', link: null}
    ]

    return (<DefaultContent breadCrumbList={breadCrumbList}><MachineCategoryForm/></DefaultContent>)
}

export default MachineCategoryPage;