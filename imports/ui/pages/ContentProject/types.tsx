import { Column } from 'material-table'

interface Row { }

export interface TableState {
  columnsProject: Array<Column<Row>>;
  dataProject: Row[];
}

export interface contentValues {
  group: string
  key: string
  meta: Object
  value: Object
}
