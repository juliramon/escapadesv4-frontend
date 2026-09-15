import JsonLd from "./JsonLd";
import { listItemsFrom } from "../../utils/listItems";

/**
 * Els elements d'una llista, com a dades.
 *
 * La llista ja es declara com a `BlogPosting`, que diu que és un text
 * publicat, però no què hi ha a dins. `ItemList` sí: els elements, en ordre, i
 * l'enllaç de cadascun quan el títol en porta.
 */
const ItemListRichSnippet = ({ html, name, url }) => {
	const items = listItemsFrom(html);
	if (items.length < 2) return null;

	return (
		<JsonLd
			data={{
				"@context": "https://schema.org",
				"@type": "ItemList",
				name,
				url,
				numberOfItems: items.length,
				itemListOrder: "https://schema.org/ItemListOrderAscending",
				itemListElement: items.map((item, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: item.name,
					url: item.url,
				})),
			}}
		/>
	);
};

export default ItemListRichSnippet;
