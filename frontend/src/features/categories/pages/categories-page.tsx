import { PlusIcon, TagIcon } from 'lucide-react'
import { useState } from 'react'

import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { QueryErrorState } from '@/components/shared/query-error-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { waitForExit } from '@/lib/motion'

import { CategoriesStats } from '../components/categories-stats'
import { CategoryCard, CategoryCardSkeleton } from '../components/category-card'
import { CategoryFormDialog } from '../components/category-form-dialog'
import { DeleteCategoryDialog } from '../components/delete-category-dialog'
import { useCategories } from '../hooks/use-categories'
import { useCreateCategory } from '../hooks/use-create-category'
import { useDeleteCategory } from '../hooks/use-delete-category'
import { useEditCategory } from '../hooks/use-edit-category'
import type { CategoryFormValues } from '../schemas/category-form-schema'
import type { CategoryListItem } from '../types'

export function CategoriesPage() {
  const { categories, isLoading, error, refetch } = useCategories()
  const { create, isSubmitting: isCreating } = useCreateCategory()
  const { edit, isSubmitting: isEditing } = useEditCategory()
  const { remove } = useDeleteCategory()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryListItem | null>(null)
  const [deleting, setDeleting] = useState<CategoryListItem | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setIsFormOpen(true)
  }

  function openEdit(category: CategoryListItem) {
    setEditing(category)
    setIsFormOpen(true)
  }

  async function handleSave(values: CategoryFormValues) {
    const saved = editing
      ? await edit(editing.id, values)
      : await create(values)
    if (saved) setIsFormOpen(false)
  }

  async function handleDelete(category: CategoryListItem) {
    setDeleting(null)
    setRemovingId(category.id)
    await waitForExit()
    const removed = await remove(category.id)
    if (!removed) setRemovingId(null)
  }

  function renderGrid() {
    if (error) {
      return (
        <Card>
          <QueryErrorState error={error} onRetry={() => refetch()} />
        </Card>
      )
    }

    if (categories?.length === 0) {
      return (
        <Card>
          <EmptyState
            icon={TagIcon}
            title="Nenhuma categoria ainda"
            description="Crie categorias para organizar suas transações."
            action={
              <Button size="sm" variant="outline" onClick={openCreate}>
                <PlusIcon aria-hidden />
                Nova categoria
              </Button>
            }
          />
        </Card>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !categories
          ? Array.from({ length: 8 }, (_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={openEdit}
                onDelete={setDeleting}
                isRemoving={category.id === removingId}
              />
            ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        action={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon aria-hidden />
            Nova categoria
          </Button>
        }
      />

      {!error && (
        <CategoriesStats
          categories={categories ?? []}
          isLoading={isLoading || !categories}
        />
      )}

      {renderGrid()}

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={editing}
        onSubmit={handleSave}
        isSubmitting={isCreating || isEditing}
      />

      <DeleteCategoryDialog
        category={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
