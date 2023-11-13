import React, {useState} from 'react';
import DefaultContent from "../containers/defaultContent";
import MachineCategoryTable from "../tables/machineCategoryTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Button} from "antd";
import MachineCategoryForm from "../forms/machineCategoryForm";

const MachineCategoryViewPage = () => {
    const [openMachineCategoryModal, setOpenMachineCategoryModal] = useState(false)
    const breadcrumbList = [
        {title: 'دسته‌بندی ماشین‌آلات', link: null},
    ]
    return (
        <>
            <DefaultContent breadCrumbList={breadcrumbList}>
                <Button shape="round"
                        className='btn-add'
                        icon={<FontAwesomeIcon icon={faPlus}/>}
                        onClick={() => setOpenMachineCategoryModal(true)}
                        style={{marginBottom: '2rem'}}
                        size='large'>
                    ثبت دسته‌بندی جدید
                </Button>

                <MachineCategoryTable/>

                {openMachineCategoryModal &&
                    <MachineCategoryForm openModal={openMachineCategoryModal}
                                         setOpenModal={setOpenMachineCategoryModal}/>
                }
            </DefaultContent>
        </>
    )
}

export default MachineCategoryViewPage;