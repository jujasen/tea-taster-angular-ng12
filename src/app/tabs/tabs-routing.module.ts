import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tea',
        loadChildren: () => import('../tea/tea.module').then((m) => m.TeaPageModule),
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then((m) => m.AboutPageModule),
      },
      {
        path: 'tasting-notes',
        loadChildren: () => import('../tasting-notes/tasting-notes.module').then((m) => m.TastingNotesPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
