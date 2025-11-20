# 🚀 Quick Start Guide - New Features

## 🔍 1. Search Events

**Location:** Events page automatically has search

**Usage:** Users just type in the search box

```tsx
// To add search to other pages, copy this pattern:
const [searchQuery, setSearchQuery] = useState('');

const filteredData = useMemo(() => {
  return data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [data, searchQuery]);

// UI:
<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full pl-12 pr-12 py-3 rounded-lg border"
/>
```

---

## 🔔 2. Notification Counter

**Location:** Navbar (auto-updates every 30 seconds)

**How it works:**
- Fetches `/api/notifications/unread`
- Shows badge if count > 0
- Displays "9+" for 10+ notifications

---

## ⚡ 3. Quick Actions Dashboard

**Location:** Admin Dashboard

**Usage:** Click any quick action card to navigate:
- Create Event (Ctrl+E)
- Add Team Member (Ctrl+T)
- Upload Photos (Ctrl+U)
- Send Notification (Ctrl+N)

---

## 🍞 4. Toast Notifications

```tsx
import { showToast } from '@/lib/toast';

// Success
showToast.success('Saved successfully!');

// Error
showToast.error('Something went wrong');

// Loading
const id = showToast.loading('Processing...');
// Later:
showToast.dismiss(id);

// With promise (auto-updates)
await showToast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save'
  }
);
```

---

## 📊 5. Export to CSV

```tsx
import { exportToCSV } from '@/lib/utils';

<Button onClick={() => exportToCSV(members, 'members')}>
  Export to CSV
</Button>

// Downloads: members_2025-11-20.csv
```

---

## 📄 6. Pagination Hook

```tsx
import { usePagination } from '@/hooks/usePagination';

const { 
  currentItems,    // Items for current page
  currentPage,     // Current page number
  totalPages,      // Total number of pages
  nextPage,        // Function to go to next page
  prevPage,        // Function to go to previous page
  hasNext,         // Boolean: has next page?
  hasPrev,         // Boolean: has previous page?
  goToPage         // Function to go to specific page
} = usePagination(allItems, 12); // 12 items per page

// Display items
{currentItems.map(item => <ItemCard key={item.id} item={item} />)}

// Pagination UI
<div className="flex gap-2">
  <Button onClick={prevPage} disabled={!hasPrev}>
    Previous
  </Button>
  <span>Page {currentPage} of {totalPages}</span>
  <Button onClick={nextPage} disabled={!hasNext}>
    Next
  </Button>
</div>
```

---

## ⌨️ 7. Keyboard Shortcuts Hook

```tsx
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

useKeyboardShortcuts({
  'ctrl+s': () => handleSave(),
  'ctrl+k': () => openSearch(),
  'ctrl+n': () => createNew(),
  'escape': () => closeModal(),
  'ctrl+/': () => showHelp(),
});
```

---

## 🖼️ 8. Drag & Drop Image Upload

```tsx
import { ImageUpload } from '@/components/ui/ImageUpload';

<ImageUpload
  onUpload={(files) => {
    files.forEach(file => {
      // Upload each file
      uploadFile(file);
    });
  }}
  multiple={true}
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

---

## 💀 9. Loading Skeletons

```tsx
import { EventCardSkeleton, CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';

{loading ? (
  <div className="grid grid-cols-3 gap-6">
    {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
  </div>
) : (
  // Actual content
  events.map(event => <EventCard key={event.id} event={event} />)
)}

// For tables
{loading ? <TableSkeleton rows={5} /> : <DataTable data={data} />}

// For generic cards
{loading ? <CardSkeleton /> : <Card>Content</Card>}
```

---

## 📋 Copy to Clipboard

```tsx
import { copyToClipboard } from '@/lib/utils';
import { showToast } from '@/lib/toast';

<Button
  onClick={async () => {
    const success = await copyToClipboard('https://example.com');
    if (success) {
      showToast.success('Link copied!');
    } else {
      showToast.error('Failed to copy');
    }
  }}
>
  Share Link
</Button>
```

---

## 🎯 Common Use Cases

### Add Search to Any Page

1. Add state: `const [searchQuery, setSearchQuery] = useState('');`
2. Filter data with `useMemo`
3. Add search input UI (copy from Events page)

### Add Bulk Actions to Lists

```tsx
const [selected, setSelected] = useState<Set<string>>(new Set());

const toggleSelect = (id: string) => {
  const newSet = new Set(selected);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  setSelected(newSet);
};

const bulkAction = async () => {
  await showToast.promise(
    Promise.all(Array.from(selected).map(id => performAction(id))),
    {
      loading: 'Processing...',
      success: `Updated ${selected.size} items`,
      error: 'Failed to update'
    }
  );
  setSelected(new Set());
};
```

### Add Pagination to Long Lists

```tsx
import { usePagination } from '@/hooks/usePagination';

const { currentItems, ...pagination } = usePagination(items, 12);

// Display only currentItems instead of all items
```

---

## 🔧 Quick Fixes

### Add "Back to Top" Button

```tsx
const [showScroll, setShowScroll] = useState(false);

useEffect(() => {
  const handleScroll = () => setShowScroll(window.scrollY > 400);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

{showScroll && (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700"
  >
    ↑
  </button>
)}
```

### Add Loading State to Any Action

```tsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await performAction();
    showToast.success('Success!');
  } catch (error) {
    showToast.error('Failed');
  } finally {
    setLoading(false);
  }
};

<Button onClick={handleAction} disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

---

## 📦 All New Files

```
✅ lib/toast.ts                              - Toast utilities
✅ hooks/usePagination.ts                    - Pagination hook
✅ hooks/useKeyboardShortcuts.ts             - Keyboard shortcuts
✅ components/ui/Skeleton.tsx                - Loading skeletons
✅ components/ui/ImageUpload.tsx             - Drag & drop upload
✅ app/api/notifications/unread/route.ts     - Unread notifications API
```

---

## 🎨 Styling Classes Reference

### Quick Action Cards
```tsx
// Color options: blue, green, purple, red
className="hover:border-blue-500"  // Hover color
className="bg-blue-100 dark:bg-blue-900/20"  // Background
className="text-blue-600 dark:text-blue-400"  // Text color
```

### Animation Classes
```tsx
className="hover:scale-110 transition-transform"  // Scale on hover
className="hover:-translate-y-1 transition-all"   // Lift on hover
className="animate-pulse"                         // Pulse animation
```

---

## 🚀 Next Steps

1. **Add search to Gallery page** - Copy from Events page
2. **Add search to Members page** - Copy from Events page
3. **Add bulk actions to Members** - See EFFECTIVE_IMPROVEMENTS.md #5
4. **Add pagination to Gallery** - Use `usePagination` hook
5. **Add export to Members page** - Use `exportToCSV` utility

---

**All features are ready to use!** No additional setup needed.

For detailed implementation examples, see `EFFECTIVE_IMPROVEMENTS.md`.
