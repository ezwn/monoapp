import React, { MouseEvent } from 'react';

import './Menu-cmp.css';
import classNames from 'classnames';

export interface Row {
  value: string;
  label: React.ReactNode;
}

export interface RowCmpProps {
  item: Row;
  onClick: (itemValue: string) => void;
  selectedItemValue: string | null;
};

const RowCmp: React.FC<RowCmpProps> = ({ item, onClick, selectedItemValue }) => {

  const onItemClick = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onClick(item.value);
  };

  return <div
    className={classNames({ item: true, selected: item.value === selectedItemValue })}
    onClick={onItemClick}
  >
    {item.label}
  </div>;
};

export interface TableCmpProps {
  items: Row[];
  onClick: (itemValue: string) => void;
  selectedItemValue: string | null;
};

export const TableCmp: React.FC<TableCmpProps> = ({ items, onClick, selectedItemValue }) => {
  return (
    <div className="table">
      {items.map((item) => (<RowCmp key={item.value} item={item} onClick={onClick} selectedItemValue={selectedItemValue} />))}
    </div>
  );
};


