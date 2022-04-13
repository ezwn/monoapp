import React, { useState } from 'react';
import { MenuCmp } from './Menu-cmp';

import './TabArea-cmp.css';

export interface Tab {
  title: string;
  node: React.ReactNode;
}

export interface TabAreaProps {
  tabs: Tab[];
};

export const TabAreaCmp: React.FC<TabAreaProps> = ({ tabs }) => {

  const [selectedTabTitle, setSelectedTabTitle] = useState(tabs[0].title);

  const tabMenuItems = tabs.map(tab => ({
    value: tab.title,
    label: tab.title
  }));

  const node = tabs.filter(tab => tab.title=== selectedTabTitle).map(tab => tab.node)[0];

  return (
    <React.Fragment>
      <MenuCmp items={tabMenuItems} selectedItemValue={selectedTabTitle} onClick={setSelectedTabTitle} />
      {node}
    </React.Fragment>
  );
};
