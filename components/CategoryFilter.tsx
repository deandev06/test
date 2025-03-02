import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === null && styles.selectedButton
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text 
          style={[
            styles.categoryText,
            selectedCategory === null && styles.selectedText
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedButton
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text 
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: '#FF5757',
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  selectedText: {
    color: '#fff',
  },
});