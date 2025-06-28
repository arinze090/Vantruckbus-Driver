import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {HERE_API_KEY, GOOGLE_MAPS_PLACES_API_KEY} from '@env';
import debounce from 'lodash.debounce';
import polyline from '@mapbox/polyline';
import {useDispatch, useSelector} from 'react-redux';

import BookingFormInput from './BookingFormInput';
import {COLORS} from '../../themes/themes';

const GoogleSearchInput = ({onSelect, formInputTitle}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const reduxLocationCoordinates = state?.user?.userLocationCoordinates;
  console.log('reduxLocationCoordinates', reduxLocationCoordinates);

  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQueryData, setSelectedQueryData] = useState();
  console.log('selectedQueryData', selectedQueryData, suggestions, query);

  // fetches suggestions when the user is typing in the input using HERE API
  const fetchSuggestions = async text => {
    if (!text) {
      return setSuggestions([]);
    }

    try {
      setLoading(true);

      const res = await axios.get(
        'https://autosuggest.search.hereapi.com/v1/autosuggest',
        {
          params: {
            q: text,
            apiKey: HERE_API_KEY,
            at: `${reduxLocationCoordinates?.latitude},${reduxLocationCoordinates?.longitude}`,
          },
        },
      );

      console.log('fetchSuggestions', res?.data?.items);
      setLoading(false);

      setSuggestions(res?.data?.items || []);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching suggestions', error?.response);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  const handleInputChange = text => {
    setQuery(text);
    debouncedFetch(text);
  };

  const handleSelect = itemx => {
    console.log('Selected location:', itemx);
    setSelectedQueryData(itemx);
    setQuery(itemx?.title);
    setIsSelected(true);
    setSuggestions([]);
  };

  useEffect(() => {
    if (!isSelected) {
      debouncedFetch;
    }
  }, [query]);

  return (
    <View>
      <BookingFormInput
        formInputTitle={formInputTitle}
        placeholder="Search destination or city"
        leftIcon="search-outline"
        iconColor={COLORS.vtbBtnColor}
        value={query}
        onChangeText={handleInputChange}
      />

      {loading && (
        <ActivityIndicator
          size="small"
          color={COLORS.vtbBtnColor}
          style={{marginTop: 10}}
        />
      )}

      {suggestions?.length && (
        <View
          style={{
            borderRadius: 4,
            marginTop: 10,
          }}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  handleSelect(item);
                }}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                  padding: 10,
                }}>
                <Text style={{color: 'black'}}>{item?.title}</Text>
                {item?.address && (
                  <Text style={{color: '#888'}}>{item?.address?.label}</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default GoogleSearchInput;

const styles = StyleSheet.create({});
