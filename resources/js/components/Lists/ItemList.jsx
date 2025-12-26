import styles from "./css/topic-item-list.module.css";

export default function ItemList({ items, render, fallback }) {
    return (
        <div id="topic-item-list" className={styles.topicItemContainer}>
            {!Array.isArray(items) || items.length === 0 ? (
                fallback()
            ) : (
                <>
                    <div
                        id="vertical-line"
                        className={styles.verticalLine}
                    ></div>
                    <ul id="item-list" className={styles.itemList}>
                        {items.map((topicItem, index) => {
                            return <li id="item" key={index}>{render(topicItem, index)}</li>;
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
