import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PillButton, TextLink } from '@/components/button';
import { Chip, ChipRow } from '@/components/chip';
import { Page } from '@/components/page';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { CATEGORY_ORDER, INGREDIENTS } from '@/data/ingredients';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { PantryItem } from '@/types';

type Filter = 'all' | 'low' | 'produce' | 'dairy' | 'pantry';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Running low' },
  { key: 'produce', label: 'Produce' },
  { key: 'dairy', label: 'Dairy' },
  { key: 'pantry', label: 'Pantry' },
];

export default function PantryScreen() {
  const { colors } = useTheme();
  const { state, addPantryItems, removePantryItem, restorePantryItem, togglePantryStatus } = useApp();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const pantryIds = new Set(state.pantry.map((item) => item.id));
  const lowCount = state.pantry.filter((item) => item.status === 'low').length;

  const normalizedQuery = query.trim().toLowerCase();
  const available = INGREDIENTS.filter((ingredient) => !pantryIds.has(ingredient.id));
  const suggestions = available
    .filter((ingredient) => !normalizedQuery || ingredient.name.toLowerCase().includes(normalizedQuery))
    .slice(0, bulkMode ? 8 : 4);

  const openDropdown = (bulk: boolean) => {
    setBulkMode(bulk);
    setOpen(true);
  };

  const addSelected = () => {
    if (!selected.length) {
      showToast('Tick at least one ingredient first');
      return;
    }
    const names = selected.map(
      (id) => INGREDIENTS.find((ingredient) => ingredient.id === id)?.name ?? id,
    );
    addPantryItems(selected);
    showToast(`Added ${names.join(' and ')} to your pantry`);
    setSelected([]);
    setQuery('');
    setOpen(false);
    setBulkMode(false);
    Keyboard.dismiss();
  };

  const catalogOrder = new Map(INGREDIENTS.map((ingredient, index) => [ingredient.id, index]));
  const filteredPantry = state.pantry.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'low') return item.status === 'low';
    if (filter === 'produce') return item.category === 'Produce';
    if (filter === 'dairy') return item.category === 'Dairy & Eggs';
    return item.category === 'Pantry';
  }).sort((a, b) => (catalogOrder.get(a.id) ?? 999) - (catalogOrder.get(b.id) ?? 999));

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: filteredPantry.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  const removeItem = (item: PantryItem) => {
    removePantryItem(item);
    showToast(`Removed ${item.name}`, {
      actionLabel: 'Undo',
      onAction: () => restorePantryItem(item),
    });
  };

  const countLabel = `${state.pantry.length} item${state.pantry.length === 1 ? '' : 's'} · ${lowCount} running low`;

  return (
    <Page scroll>
      <View style={styles.header}>
        <AppText variant="display">Pantry</AppText>
        <PillButton label="+ Bulk add" onPress={() => openDropdown(true)} />
      </View>
      <AppText variant="meta" color={colors.sub} style={{ marginTop: 2 }}>
        {countLabel}
      </AppText>

      <View style={{ marginTop: 18 }}>
        <TextField
          icon="search"
          placeholder="Add an ingredient"
          value={query}
          onChangeText={(next) => {
            setQuery(next);
            if (next.length > 0) {
              setOpen(true);
              setBulkMode(false);
            }
          }}
          onFocus={() => openDropdown(bulkMode)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          right={
            open ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close suggestions"
                hitSlop={8}
                onPress={() => {
                  setOpen(false);
                  setBulkMode(false);
                  setQuery('');
                  Keyboard.dismiss();
                }}>
                <Ionicons name="close" size={18} color={colors.sub} />
              </Pressable>
            ) : undefined
          }
        />
      </View>

      {open && (
        <View
          style={[
            styles.dropdown,
            { borderColor: colors.line, backgroundColor: colors.surface },
          ]}>
          <AppText variant="small" color={colors.sub} style={{ marginBottom: 2 }}>
            {normalizedQuery ? `Matches for “${query.trim()}”` : 'Suggested additions'}
          </AppText>

          {suggestions.map((ingredient) => {
            const checked = selected.includes(ingredient.id);
            return (
              <Pressable
                key={ingredient.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                onPress={() =>
                  setSelected((prev) =>
                    prev.includes(ingredient.id)
                      ? prev.filter((id) => id !== ingredient.id)
                      : [...prev, ingredient.id],
                  )
                }
                style={({ pressed }) => [
                  styles.suggestion,
                  { borderBottomColor: colors.line, opacity: pressed ? 0.7 : 1 },
                ]}>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: checked ? 0 : 1.5,
                    borderColor: colors.sub,
                    backgroundColor: checked ? colors.primary : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {checked && <Ionicons name="checkmark" size={13} color={colors.onPrimary} />}
                </View>
                <AppText variant="body">{ingredient.name}</AppText>
                <AppText variant="small" color={colors.sub} style={{ marginLeft: 'auto' }}>
                  {ingredient.category}
                </AppText>
              </Pressable>
            );
          })}

          {suggestions.length === 0 && (
            <AppText variant="meta" color={colors.sub} style={{ paddingVertical: 10 }}>
              {normalizedQuery
                ? 'Nothing in the catalog matches that. Try another name.'
                : 'Everything in the catalog is already in your pantry.'}
            </AppText>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={addSelected}
            style={({ pressed }) => ({
              marginTop: 10,
              height: 36,
              borderRadius: Radius.sm,
              backgroundColor: selected.length ? colors.primary : colors.placeholder,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <AppText
              variant="label"
              style={{
                fontFamily: Fonts.semibold,
                fontSize: 13,
                color: selected.length ? colors.onPrimary : colors.sub,
              }}>
              {selected.length
                ? `Add ${selected.length} item${selected.length === 1 ? '' : 's'}`
                : 'Select items to add'}
            </AppText>
          </Pressable>
        </View>
      )}

      <View style={{ marginTop: 16 }}>
        <ChipRow>
          {FILTERS.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={filter === option.key}
              onPress={() => setFilter(option.key)}
            />
          ))}
        </ChipRow>
      </View>

      <View style={{ marginTop: 18 }}>
        {grouped.map((group) => (
          <View key={group.category} style={{ marginBottom: 8 }}>
            <AppText
              variant="small"
              color={colors.sub}
              style={styles.categoryHeader}>
              {group.category.toUpperCase()}
            </AppText>
            {group.items.map((item) => (
              <PantryRow
                key={item.id}
                item={item}
                onToggle={() => togglePantryStatus(item)}
                onRemove={() => removeItem(item)}
              />
            ))}
          </View>
        ))}

        {grouped.length === 0 && (
          <View style={{ paddingVertical: 28, alignItems: 'center', gap: 6 }}>
            <AppText variant="item">Nothing here yet.</AppText>
            <TextLink label="Show all items" onPress={() => setFilter('all')} muted />
          </View>
        )}
      </View>
    </Page>
  );
}

function PantryRow({
  item,
  onToggle,
  onRemove,
}: {
  item: PantryItem;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const { colors } = useTheme();
  const low = item.status === 'low';

  return (
    <View style={[styles.row, { borderBottomColor: colors.line }]}>
      <AppText variant="body" style={{ flex: 1 }}>
        {item.name}
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.name} — ${low ? 'running low' : 'have'}. Tap to change.`}
        onPress={onToggle}
        hitSlop={10}>
        <View
          style={{
            height: 22,
            borderRadius: Radius.pill,
            borderWidth: 1,
            borderColor: low ? colors.accent : colors.line,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText
            style={{
              fontFamily: Fonts.semibold,
              fontSize: 11,
              color: low ? colors.accent : colors.fg,
            }}>
            {low ? 'Running low' : 'Have'}
          </AppText>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.name}`}
        onPress={onRemove}
        hitSlop={10}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: colors.sub,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="remove" size={12} color={colors.sub} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: 12,
  },
  suggestion: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  categoryHeader: {
    fontFamily: Fonts.semibold,
    letterSpacing: 0.6,
    paddingVertical: 10,
  },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
