import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Props Typescript
import type { DatatableProps } from './DatatableProps.js';

// Styling.
import './style.css'

interface tableStates {
    data : any
}

class Datatable extends React.Component<DatatableProps, tableStates, {}> {
 constructor(props: DatatableProps){
    super(props);
    const { products } = this.props;

    this.state = {
        data : products
    }
 }

 public render(): React.ReactElement<DatatableProps> {
    const {data} = this.state;
    return (
        <>
             <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
        </>
    )
 }
}

export default Datatable;