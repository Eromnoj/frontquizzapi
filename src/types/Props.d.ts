export type inputsComponentProps = {
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'tel' | 'search' | 'select' | 'textarea' | 'day' | 'checkbox';
  label: string;
  name?: string;
  option?: string[];
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  tabIndex?: number; // Add tabIndex prop
};


export type ButtonComponentProps = {
  title: string;
  type?: 'button' | 'submit' | 'reset';
  display: 'open' | 'insert' | 'warning';
  onClick?: () => void;
  src?: string;
};


export type PaginationComponentProps = {
    currentPage: number;
    totalPages: number;
    previousPage: () => void;
    nextPage: () => void;
}

export type SquareButtonComponentProps = {
  type: 'edit' | 'delete' | 'search' | 'left' | 'right' | 'down' | 'check' | 'close';
  click?: () => void;
};

export type ListsComponentProps = {
  type: 'productStock' | 'productProvider' | 'orders' | 'recipes';
  refetch?: () => void;
  entries: ProductStockType[] | ProductProviderType[] | OrderType[] | RecipeType[];
}

export type ProvidersProductsItemsProps = {
  entry: ProductProviderType;
  refetch?: () => void;
}

export type ProductStockItemsProps = {
  entry: ProductStockType;
}

export type OrderItemsProps = {
  entry: OrderType;
}

export type RecipesItemsProps = {
  entry: RecipeType;
}

export type ProvidersModalProps = {
  id?: number;
  close: () => void;
}

export type ProvidersProductsModalProps = {
  id?: number;
  close: () => void;
}

export type SideListsComponentProps = {
  id: number;
  title: string;
  list: EntryType[];
  click: (id: number) => void;
}

export interface TestComponentProps {
  name: string | null
}

export type MainLayoutProps = {
  children: ReactNode;
};

export type ListsComponentProps = {
  type: 'productStock' | 'productProvider' | 'orders' | 'recipes';
  entries: ProductStockType[] | ProductProviderType[] | OrderType[] | RecipeType[];
}

export type AlertDeleteModalProps = {
  mutation: () => void;
  close: () => void;
};

export type inputsComponentProps = {
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'tel' | 'search' | 'select' | 'textarea' | 'day' | 'checkbox';
  label: string;
  name?: string;
  option?: CategoryType[];
  placeholder?: string;
  value?: string | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  tabIndex?: number; // Add tabIndex prop
};
