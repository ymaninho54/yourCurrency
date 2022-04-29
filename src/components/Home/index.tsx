import { View, Text, FlatList, Image, Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StyleHome, RenderItem, SwipeableAction } from './styles'
import { CoinsContext } from '../../context/coinsContext'
import { DataCoins } from '../../models/dataCoinsModel'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView, RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModalConvert } from '../ModalConvert'
import { serviceDataCoins } from '../../services/dataCoinsService'
import { Icon } from 'react-native-elements'

export default function Home() {
  const coinsContext = useContext(CoinsContext)
  const [visible, setVisible] = useState(false)
  const [newCurrency, setNewCurrency] = useState<number | null>(0)
  const [onSwipeable, setOnSwipeable] = useState(false)
  const [currencyPress, setCurrencyPress] = useState<DataCoins>({
    code: 'USD',
    codein: 'TEST',
    high: '',
    image: '',
    name: '',
    selected: true,
    symbol: '',
    isShow: true
  })

  if (!coinsContext) return null
  const { state, dispatch, showCurrencys } = coinsContext

  const renderSwipeableAction = (code: string) => {

    return (
      <RectButton style={SwipeableAction.container} onPress={() => dispatch({ type: 'removeCoin', payload: code })}>
        <Icon color='white' name='close' />
      </RectButton>
    )
  }

  const renderItem = ({ item }: { item: DataCoins }) => {

    if (item.isShow) {

      return (
        <GestureHandlerRootView style={{ backgroundColor: '#fa4646' }}>
          <Swipeable
            renderRightActions={() => renderSwipeableAction(item.codein)}
            onSwipeableOpen={() => setOnSwipeable(true)}
            onSwipeableClose={() => setOnSwipeable(false)}>
            <TouchableWithoutFeedback
              onPress={() => { setVisible(true); setCurrencyPress(item) }}
              disabled={onSwipeable ? true : false}>
              <Animated.View style={[RenderItem.bg, item.selected ? { backgroundColor: '#d0facc' } : { backgroundColor: '#f1f1f1' }]}>
                <View style={RenderItem.content}>
                  <View style={RenderItem.flag}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: item.image }} />
                  </View>

                  <View style={RenderItem.nameCurrency}>
                    <Text style={{ color: 'gray' }}>{item.codein}</Text>
                    <Text>{item.name}</Text>
                  </View>
                </View>

                <Animated.View
                  style={[RenderItem.valueCurrency, item.selected ? { backgroundColor: '#19a50d' } : null]}>
                  <Text style={item.selected ? { color: 'white' } : { color: '#13730A' }}>{item.symbol + ' ' + item.high}</Text>
                </Animated.View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Swipeable>
        </GestureHandlerRootView>
      )
    } else {
      return null
    }
  }

  const ItemSeparatorComponent = () => {

    if (showCurrencys.length > 1){
      return (
        <View style={
          {
            height: 0.5, marginLeft: 20,
            marginRight: 20, backgroundColor: '#dddddd'
          }} />
      )
    }
    else{
      return null
    }

  }

  return (
    <StyleHome>
      <FlatList
        data={state}
        extraData={state}
        keyExtractor={(coin) => coin.codein}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={ItemSeparatorComponent}>
      </FlatList>

      <ModalConvert
        visible={visible}
        setVisible={setVisible}
        newCurrency={newCurrency}
        setNewCurrency={setNewCurrency}
        currencyPress={currencyPress} />

    </StyleHome>
  )
}

