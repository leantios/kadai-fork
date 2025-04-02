/*
 * Copyright [2024] [envite consulting GmbH]
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 *
 */

package io.kadai.user.internal;

import static io.kadai.common.internal.util.SqlProviderUtil.CLOSING_SCRIPT_TAG;
import static io.kadai.common.internal.util.SqlProviderUtil.DB2_WITH_UR;
import static io.kadai.common.internal.util.SqlProviderUtil.OPENING_SCRIPT_TAG;
import static io.kadai.user.api.UserQueryColumnName.DATA;
import static io.kadai.user.api.UserQueryColumnName.E_MAIL;
import static io.kadai.user.api.UserQueryColumnName.FIRST_NAME;
import static io.kadai.user.api.UserQueryColumnName.FULL_NAME;
import static io.kadai.user.api.UserQueryColumnName.LASTNAME;
import static io.kadai.user.api.UserQueryColumnName.LONG_NAME;
import static io.kadai.user.api.UserQueryColumnName.MOBILE_PHONE;
import static io.kadai.user.api.UserQueryColumnName.ORG_LEVEL_1;
import static io.kadai.user.api.UserQueryColumnName.ORG_LEVEL_2;
import static io.kadai.user.api.UserQueryColumnName.ORG_LEVEL_3;
import static io.kadai.user.api.UserQueryColumnName.ORG_LEVEL_4;
import static io.kadai.user.api.UserQueryColumnName.PHONE;
import static io.kadai.user.api.UserQueryColumnName.USER_ID;

import io.kadai.user.api.UserQueryColumnName;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.stream.Collectors;

public class UserMapperSqlProvider {

  private static final String USER_INFO_COLUMNS =
      Arrays.stream(UserQueryColumnName.values())
              .filter(
                  column ->
                      !EnumSet.of(UserQueryColumnName.GROUPS, UserQueryColumnName.PERMISSIONS)
                          .contains(column))
              .map(UserQueryColumnName::toString)
              .collect(Collectors.joining(", "))
          + " ";
  private static final String USER_INFO_VALUES =
      "#{id}, #{firstName}, #{lastName}, #{fullName}, #{longName}, #{email}, #{phone}, "
          + "#{mobilePhone}, #{orgLevel4}, #{orgLevel3}, #{orgLevel2}, #{orgLevel1}, #{data} ";

  private UserMapperSqlProvider() {}

  public static String findById() {
    return OPENING_SCRIPT_TAG
        + "SELECT "
        + USER_INFO_COLUMNS
        + "FROM USER_INFO "
        + "WHERE "
        + USER_ID
        + " = #{id} "
        + DB2_WITH_UR
        + CLOSING_SCRIPT_TAG;
  }

  public static String findByIds() {
    return OPENING_SCRIPT_TAG
        + "SELECT "
        + USER_INFO_COLUMNS
        + "FROM USER_INFO "
        + "WHERE "
        + USER_ID
        + " IN (<foreach item='id' collection='ids' separator=',' >#{id}</foreach>) "
        + DB2_WITH_UR
        + CLOSING_SCRIPT_TAG;
  }

  public static String findGroupsById() {
    return OPENING_SCRIPT_TAG
        + "SELECT GROUP_ID FROM GROUP_INFO WHERE "
        + USER_ID
        + " = #{id} "
        + DB2_WITH_UR
        + CLOSING_SCRIPT_TAG;
  }

  public static String findPermissionsById() {
    return OPENING_SCRIPT_TAG
        + "SELECT PERMISSION_ID FROM PERMISSION_INFO WHERE "
        + USER_ID
        + " = #{id} "
        + DB2_WITH_UR
        + CLOSING_SCRIPT_TAG;
  }

  public static String insert() {
    return "INSERT INTO USER_INFO ( " + USER_INFO_COLUMNS + ") VALUES(" + USER_INFO_VALUES + ")";
  }

  public static String insertGroups() {
    return OPENING_SCRIPT_TAG
        + "INSERT INTO GROUP_INFO ("
        + USER_ID
        + ", GROUP_ID) VALUES "
        + "<foreach item='group' collection='groups' open='(' separator='),(' close=')'>"
        + "#{id}, #{group}"
        + "</foreach> "
        + CLOSING_SCRIPT_TAG;
  }

  public static String insertPermissions() {
    return OPENING_SCRIPT_TAG
        + "INSERT INTO PERMISSION_INFO ("
        + USER_ID
        + ", PERMISSION_ID) VALUES "
        + "<foreach item='permission' collection='permissions' "
        + "open='(' separator='),(' close=')'>"
        + "#{id}, #{permission}"
        + "</foreach> "
        + CLOSING_SCRIPT_TAG;
  }

  public static String update() {
    return "UPDATE USER_INFO "
        + "SET "
        + FIRST_NAME
        + " = #{firstName}, "
        + LASTNAME
        + " = #{lastName}, "
        + FULL_NAME
        + " = #{fullName}, "
        + LONG_NAME
        + " = #{longName}, "
        + E_MAIL
        + " = #{email}, "
        + PHONE
        + " = #{phone}, "
        + MOBILE_PHONE
        + " = #{mobilePhone}, "
        + ORG_LEVEL_4
        + " = #{orgLevel4}, "
        + ORG_LEVEL_3
        + " = #{orgLevel3}, "
        + ORG_LEVEL_2
        + " = #{orgLevel2}, "
        + ORG_LEVEL_1
        + " = #{orgLevel1}, "
        + DATA
        + " = #{data} "
        + "WHERE "
        + USER_ID
        + " = #{id} ";
  }

  public static String delete() {
    return "DELETE FROM USER_INFO WHERE " + USER_ID + " = #{id} ";
  }

  public static String deleteGroups() {
    return "DELETE FROM GROUP_INFO WHERE " + USER_ID + " = #{id} ";
  }

  public static String deletePermissions() {
    return "DELETE FROM PERMISSION_INFO WHERE " + USER_ID + " = #{id} ";
  }
}
