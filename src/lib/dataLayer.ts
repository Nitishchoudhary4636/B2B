import { useEffect } from "react";
import type { DependencyList } from "react";
import type { Product } from "@/data/products";

type McpCartItem = {
  item_id: string;
  item_sku: string;
  item_name: string;
  price: number;
  quantity: number;
  item_url?: string;
  imageUrl?: string;
  category?: string;
  color?: string;
  size?: string;
};

type McpPayload = Record<string, unknown> & {
  pageName?: string;
  pageType?: string;
  currency?: string;
  itemListId?: string;
  itemListName?: string;
  items?: McpCartItem[];
  Item?: Record<string, unknown>;
};

declare global {
  interface Window {
    dataLayer?: Array<{ MCP?: McpPayload; [key: string]: unknown }>;
  }
}

export function setMcpDataLayer(payload: McpPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = [{ MCP: payload }];
}

export function useMcpDataLayer(payload: McpPayload, deps: DependencyList = []) {
  useEffect(() => {
    setMcpDataLayer(payload);
  }, deps.length ? deps : [payload]);
}

export function toMcpCartItem(product: Product, quantity = 1): McpCartItem {
  return {
    item_id: product.id,
    item_sku: product.sku,
    item_name: product.name,
    price: product.price,
    quantity,
    item_url: `/product/${product.slug}`,
    imageUrl: product.image,
    category: product.categoryName,
  };
}

export function toMcpProductItem(product: Product) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    imageUrl: product.image,
    url: `/product/${product.slug}`,
    currency: "USD",
    price: product.price,
    availability: product.stock === "out" ? "OutOfStock" : "InStock",
    category: product.categoryName,
    color: null,
    size: null,
  };
}