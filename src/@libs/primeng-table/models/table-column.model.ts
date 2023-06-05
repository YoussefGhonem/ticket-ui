export interface TableColumn<T> {
  title: string;
  field: keyof T | string;
  visible: boolean;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'datetime' | 'price' | 'number' | 'int' | 'percent' | 'bool' | 'custom' | 'select';
  allowSorting: boolean;
  cssClasses?: string[];
}
