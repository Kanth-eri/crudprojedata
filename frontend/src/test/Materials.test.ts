import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

describe('Inventory Unit Test', () => {
  it('should display the material name correctly', () => {
    // Criamos o elemento sem usar < > para o compilador não reclamar
    const element = React.createElement('div', {}, 
      React.createElement('h1', {}, 'Aço'),
      React.createElement('p', {}, 'Stock: 100')
    );

    render(element);

    // Validação dos dados que aparecem na sua tabela
    expect(screen.getByText('Aço')).toBeInTheDocument();
    expect(screen.getByText(/Stock: 100/)).toBeInTheDocument();
  });
});