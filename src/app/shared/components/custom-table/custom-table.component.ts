import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  input,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import {
  lucideCheck,
  lucideEllipsis,
  lucideChevronDown,
  lucideChevronsUpDown,
} from '@ng-icons/lucide';

import {
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  FilterFn,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table';

interface HeaderDataTable {
  id: string;
  title: string;
}

const customFilterFn: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();
  const rowValues = Object.keys(row.original)
    .map((key) => row.original[key])
    .join(' ')
    .toLowerCase();
  return rowValues.includes(filterValue);
};

@Component({
  selector: 'shared-custom-table',
  imports: [
    BrnMenuTriggerDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    CommonModule,
    FlexRenderDirective,
    HlmButtonDirective,
    HlmCheckboxComponent,
    HlmCommandImports,
    HlmIconComponent,
    HlmInputDirective,
    HlmMenuModule,
    HlmPopoverContentDirective,
    HlmTableModule,
  ],
  templateUrl: './custom-table.component.html',
  providers: [
    provideIcons({
      lucideCheck,
      lucideEllipsis,
      lucideChevronDown,
      lucideChevronsUpDown,
    }),
  ],
  host: {
    class: 'w-full',
  },
})
export default class CustomTableComponent {
  public readonly data = input.required<any[]>();
  public readonly pageSizes = input<number[]>([10, 20, 30, 50]);
  public readonly columnHeaders = input.required<HeaderDataTable[]>();
  public readonly showActions = input(false, { transform: booleanAttribute });
  public edit = output<any>();

  public headerTableComboVisibility = computed<Record<string, HeaderDataTable>>(
    () => {
      let columns: Record<string, HeaderDataTable> = {};
      this.columnHeaders().forEach((header) => {
        columns[header.id] = header;
      });
      return columns;
    }
  );

  public comlumnsDefinition = computed<ColumnDef<any>[]>(() => {
    let columnsDef: ColumnDef<any>[] = [];
    columnsDef = [
      ...columnsDef,
      ...this.columnHeaders().map((headerColumn, index) => ({
        id: headerColumn.id,
        accessorFn: (row: any) => row[headerColumn.id],
        cell: (info: CellContext<any, unknown>) => info.getValue(),
        header: `<span>${headerColumn.title}</span>`,
        filterFn: index === 0 ? customFilterFn : undefined,
      })),
    ];
    if (this.showActions()) {
      columnsDef = [
        ...columnsDef,
        {
          id: 'actions',
          enableSorting: false,
          enableHiding: false,
        },
      ];
    }
    return columnsDef;
  });

  public stateCombobox = signal<'closed' | 'open'>('closed');
  public readonly columnVisibility = signal<VisibilityState>({});
  public readonly columnFilters = signal<ColumnFiltersState>([]);
  public readonly sorting = signal<SortingState>([]);
  public readonly rowSelection = signal<RowSelectionState>({});
  public readonly paginationState = signal<PaginationState>({
    pageIndex: 0,
    pageSize: this.pageSizes()[0],
  });

  public table = createAngularTable(() => ({
    data: this.data(),
    columns: this.comlumnsDefinition(),
    state: {
      columnVisibility: this.columnVisibility(),
      columnFilters: this.columnFilters(),
      sorting: this.sorting(),
      rowSelection: this.rowSelection(),
      pagination: this.paginationState(),
    },
    onPaginationChange: (pageChange) => {
      typeof pageChange === 'function'
        ? this.paginationState.update(pageChange)
        : this.paginationState.set(pageChange);
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      const visibilityState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.columnVisibility())
          : updaterOrValue;
      this.columnVisibility.set(visibilityState);
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater);
    },
    onSortingChange: (sortingChanged) => {
      sortingChanged instanceof Function
        ? this.sorting.update(sortingChanged)
        : this.sorting.set(sortingChanged);
    },
    onRowSelectionChange: (selectionChanged) => {
      this.rowSelection.set(
        typeof selectionChanged === 'function'
          ? selectionChanged(this.rowSelection())
          : selectionChanged
      );
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    enableRowSelection: true,
  }));

  public isColumnDisabled(column: any): boolean {
    const visibleColumns = this.table.getVisibleFlatColumns().length;
    const isVisible = column.getIsVisible();
    const actionsVisible = this.showActions();

    const conditions = [
      actionsVisible && visibleColumns === 3 && isVisible,
      !actionsVisible && visibleColumns === 1 && isVisible,
      actionsVisible && visibleColumns === 2 && isVisible,
      !actionsVisible && visibleColumns === 2 && isVisible,
    ];

    return conditions.some((condition) => condition);
  }

  ngOnInit(): void {
    const ids = this.columnHeaders().map((header) => header.id);
    if (ids.includes('actions')) {
      throw new Error('ID <actions> is not allowed for table header.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['pageSizes']) {
      this.paginationState.set({
        pageIndex: 0,
        pageSize: this.pageSizes()[0] ?? 5,
      });
    }
  }

  public changeStateCombobox(state: 'open' | 'closed') {
    this.stateCombobox.set(state);
  }

  public onPageSizeChange(size: number) {
    this.stateCombobox.set('closed');
    if (this.table.getState().pagination.pageSize !== size) {
      this.table.setPageSize(size);
    }
  }

  public onDeboucedInputChange(e: Event) {
    const valueSearch: string = (e.target as HTMLInputElement).value;
    this.table
      .getColumn(this.columnHeaders()[0]?.id ?? '')
      ?.setFilterValue(valueSearch);
  }

  public onSortingColumn(column: Column<Record<string, unknown>>) {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }
}
