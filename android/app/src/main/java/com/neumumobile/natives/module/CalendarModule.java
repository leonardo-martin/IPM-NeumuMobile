package com.neumumobile.natives.module;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CalendarContract;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.neumumobile.natives.dto.CalendarEventDTO;

import java.util.Objects;
import java.util.TimeZone;

public class CalendarModule extends ReactContextBaseJavaModule {

    public CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(ReadableMap readableMap, Promise promise) {

        try {
            CalendarEventDTO calendarEventDTO = new CalendarEventDTO().toDTO(readableMap);

            long calId = getCalendarId();
            if (calId == -1) {
                promise.reject("Create Event Error", "Calendar ID not found");
            }

            Activity currentActivity = getCurrentActivity();

            if (currentActivity != null) {

                Context cx = currentActivity.getApplicationContext();

                ContentResolver cr = cx.getContentResolver();
                ContentValues values = new ContentValues();
                values.put(CalendarContract.Events.DTSTART, calendarEventDTO.getDtStart());
                values.put(CalendarContract.Events.DTEND, calendarEventDTO.getDtEnd());
                values.put(CalendarContract.Events.TITLE, calendarEventDTO.getTitle());
                values.put(CalendarContract.Events.DESCRIPTION, calendarEventDTO.getDescription());
                values.put(CalendarContract.Events.CALENDAR_ID, calId);
                values.put(CalendarContract.Events.EVENT_LOCATION, calendarEventDTO.getLocation());
                values.put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().getDisplayName());
                values.put(CalendarContract.Events.ALL_DAY, calendarEventDTO.getAllDay());
                values.put(CalendarContract.Events.AVAILABILITY, CalendarContract.Events.AVAILABILITY_BUSY);

                Uri uri = cr.insert(CalendarContract.Events.CONTENT_URI, values);
                if (uri != null) {
                    String eventID = uri.getLastPathSegment();
                    Log.d("CalendarModule", "Create event called with ID: " + eventID);
                    promise.resolve(eventID);
                } else promise.reject("Create Event Error", "Uri is NULL");
            }

            promise.reject("Create Event Error", "Error ");
        } catch (Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    private long getCalendarId() {
        String[] projection = new String[]{
                CalendarContract.Calendars._ID,                           // 0
                CalendarContract.Calendars.ACCOUNT_NAME,                  // 1
                CalendarContract.Calendars.CALENDAR_DISPLAY_NAME,         // 2
                CalendarContract.Calendars.OWNER_ACCOUNT,                 // 3
        };
        String selection = CalendarContract.Calendars.VISIBLE + " = 1 AND " + CalendarContract.Calendars.IS_PRIMARY + " = 1";

        try {
            Cursor cursor = Objects.requireNonNull(getCurrentActivity()).getContentResolver().query(CalendarContract.Calendars.CONTENT_URI, projection, selection, null, null);

            if (cursor.moveToFirst()) {
                long calId = cursor.getLong(0);
                cursor.close();
                return calId;
            }
        }catch (Exception e) {
            return -1;
        }

        return -1;
    }
}