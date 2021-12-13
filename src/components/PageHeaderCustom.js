
import React from 'react'
import { PageHeader } from 'antd';
import Trans from "../usetranslation/Trans";

 function PageHeaderCustom(props) {
 
    return (
      <PageHeader
        className="site-page-header"
        title={<Trans word={props.activeSubItem} />}
      />
    );
}

export default PageHeaderCustom