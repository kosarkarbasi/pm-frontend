import React from "react";
import UnitFrom from "../forms/unitFrom";
import DefaultContent from "../containers/defaultContent";

const UnitCreatePage = () => {
    const breadcrumbList = [{title:'فرم‌ها'}, {title: 'واحد‌ها'}, {title: 'افزودن واحد'}]
    return (
        <DefaultContent breadCrumbList={breadcrumbList}><UnitFrom/></DefaultContent>
    )
}

export default UnitCreatePage;