import React from 'react';
import {StyleSheet, View, Text, Image} from "react-native";
import ScreenUtils from "../../../../utils/ScreenUtils";
import Icons from "../../../../Icons";

function StaticTodoList() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>待办事项</Text>
            <View style={styles.item}>
                <View style={styles.left}>
                    <View style={styles.line} />
                    <Text style={styles.itemTitle}>
                        新发布的职位
                    </Text>
                </View>
                <View style={styles.left}>
                    <Text style={styles.itemTitle}>3个</Text>
                    <Image
                        source={Icons.Public.More}
                        style={styles.more}
                    />
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.left}>
                    <View style={[styles.line, styles.green]} />
                    <Text style={styles.itemTitle}>
                        我发布的职位
                    </Text>
                </View>
                <View style={styles.left}>
                    <Text style={styles.itemTitle}>5个</Text>
                    <Image
                        source={Icons.Public.More}
                        style={styles.more}
                    />
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.left}>
                    <View style={[styles.line, styles.purple]} />
                    <Text style={styles.itemTitle}>
                        新签合同
                    </Text>
                </View>
                <View style={styles.left}>
                    <Text style={styles.itemTitle}>5个</Text>
                    <Image
                        source={Icons.Public.More}
                        style={styles.more}
                    />
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.left}>
                    <View style={[styles.line, styles.blue]} />
                    <Text style={styles.itemTitle}>
                        本周借款
                    </Text>
                </View>
                <View style={styles.left}>
                    <Text style={styles.itemTitle}>20人</Text>
                    <Image
                        source={Icons.Public.More}
                        style={styles.more}
                    />
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.left}>
                    <View style={[styles.line, styles.orange]} />
                    <Text style={styles.itemTitle}>
                        离职申请
                    </Text>
                </View>
                <View style={styles.left}>
                    <Text style={styles.itemTitle}>2人</Text>
                    <Image
                        source={Icons.Public.More}
                        style={styles.more}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: ScreenUtils.scaleSize(10),
        paddingVertical: ScreenUtils.scaleSize(25),
        paddingHorizontal: ScreenUtils.scaleSize(15),
    },
    title: {
        color: '#030014',
        fontSize: ScreenUtils.scaleSize(16),
        fontWeight: "bold",
        marginBottom: ScreenUtils.scaleSize(19)
    },
    item:{
        height: ScreenUtils.scaleSize(55),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: ScreenUtils.scaleSize(5),
        marginVertical: ScreenUtils.scaleSize(5),
        // overflow: "hidden",

        elevation: 6,
        shadowColor: 'rgba(37, 48, 57, 0.08)',  //  阴影颜色
        shadowOffset: { width: 0, height: 0 },  // 阴影偏移
        shadowOpacity: 1,  // 阴影不透明度
        shadowRadius: 10,  //  圆角
        backgroundColor: '#fff',
    },
    left: {
        alignItems: "center",
        flexDirection: "row",
    },
    itemTitle: {
        color: '#030014',
        fontSize: ScreenUtils.scaleSize(15),
    },
    line: {
        width: ScreenUtils.scaleSize(5),
        backgroundColor: '#526CDD',
        height: ScreenUtils.scaleSize(55),
        marginRight: ScreenUtils.scaleSize(14),
        borderBottomLeftRadius: ScreenUtils.scaleSize(5),
        borderTopLeftRadius: ScreenUtils.scaleSize(5),
    },
    green: {
        backgroundColor: '#5FCC92',
    },
    purple: {
        backgroundColor: '#916AF3',
    },
    blue: {
        backgroundColor: '#6AB7F3',
    },
    orange: {
        backgroundColor: '#F89F49',
    },
    more: {
        height: ScreenUtils.scaleSize(16),
        width: ScreenUtils.scaleSize(16),
        marginLeft: ScreenUtils.scaleSize(15),
        marginRight: ScreenUtils.scaleSize(10),

    }
})

export default StaticTodoList;
