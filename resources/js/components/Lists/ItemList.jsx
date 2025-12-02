import styles from "./css/topic-item-list.module.css";

export default function ItemList({ items, render }) {
    return (
        <div id="topic-item-list" className={styles.topicItemContainer}>
            <div id="vertical-line" className={styles.verticalLine}></div>
            <ul id="item-list" className={styles.itemList}>
                {items.map(topicItem => {
                    return (
                        <li id="item">
                            {render(topicItem)}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
