import { Column } from 'material-table'

interface Row { }

export interface TableState {
  columnsApplication: Array<Column<Row>>;
  dataApplication: Row[];
  dataProject: Row[];
}

export interface contentValues {
  group: string
  key: string
  meta: Object
  value: Object
}
