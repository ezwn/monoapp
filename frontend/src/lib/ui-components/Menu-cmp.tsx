import React, { MouseEvent } from 'react';

import './Menu-cmp.css';
import classNames from 'classnames';

export interface MenuItem {
  value: string;
  label: React.ReactNode;
}

export interface MenuItemCmpProps {
  item: MenuItem;
  onClick: (itemValue: string) => void;
  selectedItemValue: string | null;
};

const MenuItemCmp: React.FC<MenuItemCmpProps> = ({ item, onClick, selectedItemValue }) => {

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

export interface MenuCmpProps {
  items: MenuItem[];
  onClick: (itemValue: string) => void;
  selectedItemValue: string | null;
};

export const MenuCmp: React.FC<MenuCmpProps> = ({ items, onClick, selectedItemValue }) => {
  return (
    <div className="menu">
      {items.map((item) => (<MenuItemCmp key={item.value} item={item} onClick={onClick} selectedItemValue={selectedItemValue} />))}
    </div>
  );
};


