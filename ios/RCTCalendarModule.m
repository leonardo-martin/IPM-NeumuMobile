    //
    //  RCTCalendarModule.m
    //  NeumuMobile
    //
    //  Created by Thiago Santana on 03/01/22.
    //
    #import "RCTCalendarModule.h"
    #import <EventKitUI/EventKitUI.h>
    
    @implementation RCTCalendarModule

    // To export a module named RCTCalendarModule
    RCT_EXPORT_MODULE(CalendarModule);

    // To export a function named createCalendarEvent
    RCT_EXPORT_METHOD(createCalendarEvent:(NSDictionary *)dictionary
                     resolver:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject)
    {
      
      NSInteger eventId = 1;
      EKEventStore *store = [[EKEventStore alloc] init];
      
      if([store respondsToSelector:@selector(requestAccessToEntityType:completion:)])
      {
        // iOS >= 6
        [store requestAccessToEntityType:EKEntityTypeEvent
                              completion:^(BOOL granted, NSError *error) {
          if (granted)
          {
            dispatch_async(dispatch_get_main_queue(), ^{
              [self createEventAndPresentViewController:store];
            });
          } else {
              NSLog(@"Favor alterar as configuracoes");
          }
        }];
      } else
      {
        // iOS <= 5
        [self createEventAndPresentViewController:store];
      }
      
      NSLog(@"%@",[dictionary valueForKey:@"title"]);
      NSLog(@"%@",[dictionary valueForKey:@"description"]);
      NSLog(@"%@",[dictionary valueForKey:@"location"]);
      
      if (eventId) {
        resolve(@(eventId));
      } else {
        reject(@"event_failure", @"no event id returned", nil);
      }
    }

    - (void)createEventAndPresentViewController:(EKEventStore *)store
    {
        EKEvent *event = [self findOrCreateEvent:store];

        EKEventEditViewController *controller = [[EKEventEditViewController alloc] init];
        controller.event = event;
        controller.eventStore = store;
        controller.editViewDelegate = self;

//        [self presentViewController:controller animated:YES completion:nil];
    }

    - (EKEvent *)findOrCreateEvent:(EKEventStore *)store
    {
        NSString *title = @"My event title";

        // try to find an event

        EKEvent *event = [self findEventWithTitle:title inEventStore:store];

        // if found, use it

        if (event)
            return event;

        // if not, let's create new event

        event = [EKEvent eventWithEventStore:store];

        event.title = title;
        event.notes = @"My event notes";
        event.location = @"My event location";
        event.calendar = [store defaultCalendarForNewEvents];

        NSCalendar *calendar = [NSCalendar currentCalendar];
        NSDateComponents *components = [[NSDateComponents alloc] init];
        components.hour = 4;
        event.startDate = [calendar dateByAddingComponents:components
                                                    toDate:[NSDate date]
                                                   options:0];
        components.hour = 1;
        event.endDate = [calendar dateByAddingComponents:components
                                                  toDate:event.startDate
                                                 options:0];

        return event;
    }

    - (EKEvent *)findEventWithTitle:(NSString *)title inEventStore:(EKEventStore *)store
    {
        // Get the appropriate calendar
        NSCalendar *calendar = [NSCalendar currentCalendar];

        // Create the start range date components
        NSDateComponents *oneDayAgoComponents = [[NSDateComponents alloc] init];
        oneDayAgoComponents.day = -1;
        NSDate *oneDayAgo = [calendar dateByAddingComponents:oneDayAgoComponents
                                                      toDate:[NSDate date]
                                                     options:0];

        // Create the end range date components
        NSDateComponents *oneWeekFromNowComponents = [[NSDateComponents alloc] init];
        oneWeekFromNowComponents.day = 7;
        NSDate *oneWeekFromNow = [calendar dateByAddingComponents:oneWeekFromNowComponents
                                                           toDate:[NSDate date]
                                                          options:0];

        // Create the predicate from the event store's instance method
        NSPredicate *predicate = [store predicateForEventsWithStartDate:oneDayAgo
                                                                endDate:oneWeekFromNow
                                                              calendars:nil];

        // Fetch all events that match the predicate
        NSArray *events = [store eventsMatchingPredicate:predicate];

        for (EKEvent *event in events)
        {
            if ([title isEqualToString:event.title])
            {
                return event;
            }
        }

        return nil;
    }

    @end
